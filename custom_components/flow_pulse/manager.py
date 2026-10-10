"""Snoozes: turn an automation off now and back on later, even with no dashboard open."""

from __future__ import annotations

from collections.abc import Callable, Iterable
from datetime import datetime
import logging
from typing import Any

from homeassistant.const import EVENT_STATE_CHANGED, STATE_ON
from homeassistant.core import CALLBACK_TYPE, Context, Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import SIGNAL_UPDATED, SNOOZE_DOMAIN, STORAGE_KEY, STORAGE_VERSION
from .logic import deserialise, due, next_wake, serialise

_LOGGER = logging.getLogger(__name__)


class SnoozeManager:
    """Owns the snoozes: storage, the wake-up timer and the rules around manual changes."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.snoozes: dict[str, datetime] = {}
        self._unsubs: list[Callable[[], None]] = []
        self._timer: CALLBACK_TYPE | None = None
        self._started = False

    # ---- Lifecycle ----------------------------------------------------------

    async def async_setup(self) -> None:
        data = await self._store.async_load() or {}
        self.snoozes = deserialise(data.get("snoozes"))
        self._unsubs.append(
            self.hass.bus.async_listen(EVENT_STATE_CHANGED, self._state_changed, event_filter=self._is_snoozed_event)
        )
        self._unsubs.append(
            self.hass.bus.async_listen(er.EVENT_ENTITY_REGISTRY_UPDATED, self._registry_updated)
        )
        # Automations load after us on startup: wake anything overdue only once they exist.
        self._unsubs.append(async_at_started(self.hass, self._on_started))

    async def async_unload(self) -> None:
        """Stop the timer. Snoozes stay stored and resume on the next start."""
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        self._cancel_timer()

    async def async_remove(self) -> None:
        """The integration is being deleted: nothing would ever turn the snoozed automations back on."""
        ids = list(self.snoozes)
        self.snoozes.clear()
        await self._turn(ids, on=True)
        await self._store.async_remove()

    @callback
    def _on_started(self, _hass: HomeAssistant) -> None:
        self._started = True
        self._schedule()

    # ---- Public API ---------------------------------------------------------

    def snapshot(self) -> dict[str, Any]:
        return {"snoozes": serialise(self.snoozes)}

    async def async_snooze(self, entity_ids: Iterable[str], until: datetime, context: Context | None = None) -> list[str]:
        """Snooze the given automations until `until` (UTC). Returns the ones snoozed.

        An automation that is already off and not snoozed is left alone: it was switched off on purpose,
        and waking it up later would turn on something nobody asked for.
        """
        snoozed: list[str] = []
        to_turn_off: list[str] = []
        for eid in entity_ids:
            state = self.hass.states.get(eid)
            if state is None:
                continue
            if eid not in self.snoozes and state.state != STATE_ON:
                _LOGGER.debug("Not snoozing %s: it is %s", eid, state.state)
                continue
            if state.state == STATE_ON:
                to_turn_off.append(eid)
            self.snoozes[eid] = until
            snoozed.append(eid)
        if not snoozed:
            return snoozed
        await self._save()
        # A run in progress finishes; the snooze only keeps it from being triggered again.
        await self._turn(to_turn_off, on=False, context=context)
        self._schedule()
        return snoozed

    async def async_resume(self, entity_ids: Iterable[str], context: Context | None = None) -> list[str]:
        """End the snooze of the given automations now and turn them back on."""
        resumed = [eid for eid in entity_ids if self.snoozes.pop(eid, None) is not None]
        if not resumed:
            return resumed
        await self._save()
        await self._turn(resumed, on=True, context=context)
        self._schedule()
        return resumed

    # ---- Internals ----------------------------------------------------------

    async def _turn(self, entity_ids: list[str], *, on: bool, context: Context | None = None) -> None:
        present = [eid for eid in entity_ids if self.hass.states.get(eid) is not None]
        if not present:
            return
        data: dict[str, Any] = {"entity_id": present}
        if not on:
            data["stop_actions"] = False
        await self.hass.services.async_call(
            SNOOZE_DOMAIN, "turn_on" if on else "turn_off", data, blocking=True, context=context
        )

    async def _save(self) -> None:
        await self._store.async_save({"snoozes": serialise(self.snoozes)})
        async_dispatcher_send(self.hass, SIGNAL_UPDATED)

    def _cancel_timer(self) -> None:
        if self._timer is not None:
            self._timer()
            self._timer = None

    @callback
    def _schedule(self) -> None:
        self._cancel_timer()
        if not self._started:
            return
        wake = next_wake(self.snoozes)
        if wake is None:
            return
        if wake <= dt_util.utcnow():
            self.hass.async_create_task(self._async_wake(dt_util.utcnow()), eager_start=False)
        else:
            self._timer = async_track_point_in_utc_time(self.hass, self._wake_callback, wake)

    @callback
    def _wake_callback(self, now: datetime) -> None:
        self._timer = None
        self.hass.async_create_task(self._async_wake(now), eager_start=False)

    async def _async_wake(self, now: datetime) -> None:
        ids = due(self.snoozes, now)
        gone = [eid for eid in ids if self.hass.states.get(eid) is None]
        for eid in gone:
            _LOGGER.info("Snooze of %s ended, but the automation no longer exists", eid)
        await self.async_resume(ids)
        self._schedule()

    @callback
    def _is_snoozed_event(self, event_data: Any) -> bool:
        return event_data["entity_id"] in self.snoozes

    @callback
    def _state_changed(self, event: Event) -> None:
        """Someone turned a snoozed automation back on by hand: the snooze is over."""
        new = event.data.get("new_state")
        old = event.data.get("old_state")
        if new is None or new.state != STATE_ON or (old is not None and old.state == STATE_ON):
            return
        eid = event.data["entity_id"]
        if self.snoozes.pop(eid, None) is not None:
            self.hass.async_create_task(self._save(), eager_start=False)
            self._schedule()

    @callback
    def _registry_updated(self, event: Event) -> None:
        """Follow renames, so a snoozed automation whose entity id changed still wakes up."""
        data = event.data
        if data.get("action") == "update" and (old := data.get("old_entity_id")) in self.snoozes:
            self.snoozes[data["entity_id"]] = self.snoozes.pop(old)
            self.hass.async_create_task(self._save(), eager_start=False)

"""Actions: snooze and resume automations. Usable from the card, scripts, voice and other automations."""

from __future__ import annotations

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.service import async_extract_entity_ids
from homeassistant.util import dt as dt_util

from .const import ATTR_DURATION, ATTR_UNTIL, DOMAIN, SERVICE_RESUME, SERVICE_SNOOZE, SNOOZE_DOMAIN
from .helpers import require_manager
from .logic import SnoozeError, resolve_until

SNOOZE_SCHEMA = vol.Schema(
    cv.make_entity_service_schema(
        {
            vol.Exclusive(ATTR_DURATION, "when"): cv.positive_time_period,
            vol.Exclusive(ATTR_UNTIL, "when"): cv.datetime,
        }
    )
)
RESUME_SCHEMA = vol.Schema(cv.make_entity_service_schema({}))


async def _automations(hass: HomeAssistant, call: ServiceCall) -> list[str]:
    """The automations a call targets (entities, areas, devices, labels), sorted."""
    try:
        referenced = await async_extract_entity_ids(call)
    except TypeError:  # Home Assistant before 2025.10 also wanted `hass` first
        referenced = await async_extract_entity_ids(hass, call)  # type: ignore[arg-type,call-arg]
    ids = sorted(eid for eid in referenced if eid.startswith(f"{SNOOZE_DOMAIN}."))
    if not ids:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="no_automations")
    return ids


@callback
def async_register_services(hass: HomeAssistant) -> None:
    async def snooze(call: ServiceCall) -> ServiceResponse:
        manager = require_manager(hass)
        ids = await _automations(hass, call)
        until = call.data.get(ATTR_UNTIL)
        try:
            end = resolve_until(
                dt_util.utcnow(),
                call.data.get(ATTR_DURATION),
                dt_util.as_utc(until) if until is not None else None,
            )
        except SnoozeError as err:
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key=str(err)) from err
        snoozed = await manager.async_snooze(ids, end, call.context)
        return {"snoozed": snoozed, "until": end.isoformat()} if call.return_response else None

    async def resume(call: ServiceCall) -> ServiceResponse:
        manager = require_manager(hass)
        resumed = await manager.async_resume(await _automations(hass, call), call.context)
        return {"resumed": resumed} if call.return_response else None

    hass.services.async_register(
        DOMAIN, SERVICE_SNOOZE, snooze, schema=SNOOZE_SCHEMA, supports_response=SupportsResponse.OPTIONAL
    )
    hass.services.async_register(
        DOMAIN, SERVICE_RESUME, resume, schema=RESUME_SCHEMA, supports_response=SupportsResponse.OPTIONAL
    )

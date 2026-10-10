"""Snooze end to end: actions, the wake-up timer, manual changes, storage, WebSocket and the config flow."""

from __future__ import annotations

from datetime import timedelta

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from custom_components.flow_pulse.const import DOMAIN

from .conftest import BATH, DESK, HALL

CLOCK = None


def state(hass: HomeAssistant, eid: str) -> str:
    return hass.states.get(eid).state


async def snooze(hass: HomeAssistant, entity_id, **data):
    return await hass.services.async_call(
        DOMAIN, "snooze", {"entity_id": entity_id, **data}, blocking=True, return_response=True
    )


@pytest.fixture(autouse=True)
def _clock(freezer):
    global CLOCK
    CLOCK = freezer


async def later(hass: HomeAssistant, delta: timedelta) -> None:
    """Move the clock on, the way real time would."""
    CLOCK.tick(delta)
    async_fire_time_changed(hass)
    await hass.async_block_till_done()


async def test_snooze_turns_off_and_wakes_up(hass, flow_pulse):
    resp = await snooze(hass, HALL, duration={"hours": 1})
    assert resp["snoozed"] == [HALL]
    assert state(hass, HALL) == "off"
    assert flow_pulse.runtime_data.snapshot()["snoozes"].keys() == {HALL}

    await later(hass, timedelta(minutes=59))
    assert state(hass, HALL) == "off"
    await later(hass, timedelta(minutes=2))
    assert state(hass, HALL) == "on"
    assert flow_pulse.runtime_data.snapshot() == {"snoozes": {}}


async def test_until(hass, flow_pulse):
    until = dt_util.now() + timedelta(hours=3)
    resp = await snooze(hass, [HALL, DESK], until=until.replace(tzinfo=None).isoformat(timespec="seconds"))
    assert resp["snoozed"] == [DESK, HALL]
    assert state(hass, DESK) == "off"
    await later(hass, timedelta(hours=3, minutes=1))
    assert state(hass, DESK) == "on" and state(hass, HALL) == "on"


async def test_off_automation_is_left_alone(hass, flow_pulse):
    resp = await snooze(hass, BATH, duration={"hours": 1})
    assert resp["snoozed"] == []
    await later(hass, timedelta(hours=2))
    assert state(hass, BATH) == "off"


async def test_resume_and_manual_turn_on_end_the_snooze(hass, flow_pulse):
    await snooze(hass, [HALL, DESK], duration={"hours": 1})
    await hass.services.async_call(DOMAIN, "resume", {"entity_id": HALL}, blocking=True)
    assert state(hass, HALL) == "on"

    await hass.services.async_call("automation", "turn_on", {"entity_id": DESK}, blocking=True)
    await hass.async_block_till_done()
    assert flow_pulse.runtime_data.snapshot() == {"snoozes": {}}

    # Turned off by hand afterwards: the old snooze must not turn it back on.
    await hass.services.async_call("automation", "turn_off", {"entity_id": DESK}, blocking=True)
    await later(hass, timedelta(hours=2))
    assert state(hass, DESK) == "off"


async def test_validation(hass, flow_pulse):
    with pytest.raises(ServiceValidationError):
        await snooze(hass, HALL)
    with pytest.raises(ServiceValidationError):
        await snooze(hass, HALL, duration={"days": 40})
    with pytest.raises(ServiceValidationError):
        await snooze(hass, "light.kitchen", duration={"hours": 1})


async def test_snooze_by_label(hass, flow_pulse):
    from homeassistant.helpers import label_registry as lr

    label = lr.async_get(hass).async_create("Holiday")
    er.async_get(hass).async_update_entity(DESK, labels={label.label_id})
    resp = await snooze(hass, None, label_id=label.label_id, duration={"days": 7})
    assert resp["snoozed"] == [DESK]


async def test_survives_a_reload_and_wakes_overdue(hass, flow_pulse):
    await snooze(hass, HALL, duration={"minutes": 30})
    await hass.config_entries.async_unload(flow_pulse.entry_id)
    await later(hass, timedelta(hours=1))
    assert state(hass, HALL) == "off"  # nothing running while unloaded
    assert await hass.config_entries.async_setup(flow_pulse.entry_id)
    await hass.async_block_till_done()
    assert state(hass, HALL) == "on"


async def test_rename_follows(hass, flow_pulse):
    await snooze(hass, HALL, duration={"hours": 1})
    er.async_get(hass).async_update_entity(HALL, new_entity_id="automation.hallway_light")
    await hass.async_block_till_done()
    assert flow_pulse.runtime_data.snapshot()["snoozes"].keys() == {"automation.hallway_light"}
    await later(hass, timedelta(hours=2))
    assert state(hass, "automation.hallway_light") == "on"


async def test_removing_the_integration_wakes_everything(hass, flow_pulse):
    await snooze(hass, HALL, duration={"hours": 5})
    await hass.config_entries.async_remove(flow_pulse.entry_id)
    await hass.async_block_till_done()
    assert state(hass, HALL) == "on"


async def test_websocket(hass, flow_pulse, hass_ws_client):
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/subscribe"})
    assert (await client.receive_json())["success"]
    assert (await client.receive_json())["event"] == {"snoozes": {}}
    await snooze(hass, HALL, duration={"hours": 1})
    event = (await client.receive_json())["event"]
    assert list(event["snoozes"]) == [HALL]


async def test_config_flow_single_instance(hass, automations):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"

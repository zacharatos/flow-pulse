"""Fixtures: a Home Assistant with three invented automations and Flow Pulse set up."""

from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.flow_pulse.const import DOMAIN

HALL = "automation.hall_night_light"
BATH = "automation.warm_up_bathroom"
DESK = "automation.desk_lamp"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


@pytest.fixture
async def automations(hass: HomeAssistant) -> list[str]:
    assert await async_setup_component(hass, "homeassistant", {})
    config = [
        {"id": "hall", "alias": "Hall night light", "triggers": [{"trigger": "event", "event_type": "hall"}],
         "actions": [{"event": "hall_ran"}]},
        {"id": "bath", "alias": "Warm up bathroom", "initial_state": False,
         "triggers": [{"trigger": "event", "event_type": "bath"}], "actions": [{"event": "bath_ran"}]},
        {"id": "desk", "alias": "Desk lamp", "triggers": [{"trigger": "event", "event_type": "desk"}],
         "actions": [{"event": "desk_ran"}]},
    ]
    assert await async_setup_component(hass, "automation", {"automation": config})
    await hass.async_block_till_done()
    return [HALL, BATH, DESK]


@pytest.fixture
async def flow_pulse(hass: HomeAssistant, automations: list[str]) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, title="Flow Pulse", data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry

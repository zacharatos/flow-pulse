"""Flow Pulse: manage automations from the dashboard, with snooze, plus its dashboard card."""

from __future__ import annotations

from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import CARD_FILENAME, DOMAIN, FRONTEND_URL_BASE, VERSION
from .manager import SnoozeManager
from .services import async_register_services
from .websocket import async_register_websocket

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type FlowPulseConfigEntry = ConfigEntry[SnoozeManager]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    async_register_websocket(hass)
    async_register_services(hass)
    await _async_register_card(hass)
    return True


async def _async_register_card(hass: HomeAssistant) -> None:
    """Serve the card and load it on every dashboard, so no resource needs adding by hand."""
    if hass.http is None:  # e.g. tests without the HTTP server
        return
    from homeassistant.components.frontend import add_extra_js_url
    from homeassistant.components.http import StaticPathConfig

    folder = Path(__file__).parent / "frontend"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL_BASE, str(folder), cache_headers=False)]
    )
    # The version in the URL makes browsers fetch the new card after an update.
    add_extra_js_url(hass, f"{FRONTEND_URL_BASE}/{CARD_FILENAME}?v={VERSION}")


async def async_setup_entry(hass: HomeAssistant, entry: FlowPulseConfigEntry) -> bool:
    manager = SnoozeManager(hass)
    await manager.async_setup()
    entry.runtime_data = manager
    return True


async def async_unload_entry(hass: HomeAssistant, entry: FlowPulseConfigEntry) -> bool:
    await entry.runtime_data.async_unload()
    return True


async def async_remove_entry(hass: HomeAssistant, entry: FlowPulseConfigEntry) -> None:
    """Deleting Flow Pulse wakes every snoozed automation, so none stays off forever."""
    manager = SnoozeManager(hass)
    await manager.async_setup()
    await manager.async_remove()
    await manager.async_unload()

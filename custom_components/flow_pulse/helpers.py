"""Shared lookups."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError

from .const import DOMAIN

if TYPE_CHECKING:
    from .manager import SnoozeManager


def loaded_manager(hass: HomeAssistant) -> SnoozeManager | None:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    return entries[0].runtime_data if entries else None


def require_manager(hass: HomeAssistant) -> SnoozeManager:
    manager = loaded_manager(hass)
    if manager is None:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="not_loaded")
    return manager

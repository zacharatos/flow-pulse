"""Constants for Flow Pulse."""

from __future__ import annotations

from datetime import timedelta
from typing import Final

DOMAIN: Final = "flow_pulse"
VERSION: Final = "0.1.0"

STORAGE_KEY: Final = DOMAIN
STORAGE_VERSION: Final = 1

# Only automations can be snoozed (scripts have no on/off state).
SNOOZE_DOMAIN: Final = "automation"

# The longest snooze accepted: long enough for a holiday, short enough to never be forgotten forever.
MAX_SNOOZE: Final = timedelta(days=30)

ATTR_DURATION: Final = "duration"
ATTR_UNTIL: Final = "until"

SERVICE_SNOOZE: Final = "snooze"
SERVICE_RESUME: Final = "resume"

# Dispatcher signal sent whenever the snoozes change.
SIGNAL_UPDATED: Final = f"{DOMAIN}_updated"

FRONTEND_URL_BASE: Final = f"/{DOMAIN}_frontend"
CARD_FILENAME: Final = "flow-pulse-card.js"

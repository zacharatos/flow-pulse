"""The pure snooze rules."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

from custom_components.flow_pulse.logic import (
    SnoozeError,
    deserialise,
    due,
    next_wake,
    resolve_until,
    serialise,
)

NOW = datetime(2026, 10, 10, 12, 0, tzinfo=UTC)


def test_duration_and_until():
    assert resolve_until(NOW, timedelta(hours=1), None) == NOW + timedelta(hours=1)
    assert resolve_until(NOW, None, NOW + timedelta(days=2)) == NOW + timedelta(days=2)


@pytest.mark.parametrize(
    ("duration", "until", "key"),
    [
        (None, None, "duration_or_until"),
        (timedelta(hours=1), NOW + timedelta(hours=1), "duration_or_until"),
        (None, NOW - timedelta(minutes=1), "in_the_past"),
        (timedelta(0), None, "in_the_past"),
        (timedelta(days=31), None, "too_long"),
    ],
)
def test_rejected(duration, until, key):
    with pytest.raises(SnoozeError, match=key):
        resolve_until(NOW, duration, until)


def test_due_and_next_wake():
    snoozes = {"automation.b": NOW + timedelta(hours=2), "automation.a": NOW - timedelta(minutes=1), "automation.c": NOW}
    assert due(snoozes, NOW) == ["automation.a", "automation.c"]
    assert next_wake(snoozes) == NOW - timedelta(minutes=1)
    assert next_wake({}) is None


def test_round_trip_and_bad_data():
    snoozes = {"automation.a": NOW}
    assert deserialise(serialise(snoozes)) == snoozes
    assert deserialise(None) == {}
    assert deserialise({"automation.a": "nonsense", "automation.b": "2026-10-10T12:00:00", 3: "x"}) == {}

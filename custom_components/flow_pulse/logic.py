"""Pure snooze rules, with no Home Assistant imports, so they can be unit-tested on their own."""

from __future__ import annotations

from datetime import datetime, timedelta

from .const import MAX_SNOOZE


class SnoozeError(ValueError):
    """A snooze request that can't be honoured. The message is a translation key."""


def resolve_until(now: datetime, duration: timedelta | None, until: datetime | None) -> datetime:
    """When a snooze ends. Exactly one of `duration` and `until` must be given; both are UTC-aware."""
    if (duration is None) == (until is None):
        raise SnoozeError("duration_or_until")
    end = now + duration if duration is not None else until
    assert end is not None
    if end <= now:
        raise SnoozeError("in_the_past")
    if end - now > MAX_SNOOZE:
        raise SnoozeError("too_long")
    return end


def due(snoozes: dict[str, datetime], now: datetime) -> list[str]:
    """Entity ids whose snooze has ended, oldest first."""
    return [eid for eid, end in sorted(snoozes.items(), key=lambda kv: kv[1]) if end <= now]


def next_wake(snoozes: dict[str, datetime]) -> datetime | None:
    """The earliest end of all snoozes, or None when nothing is snoozed."""
    return min(snoozes.values(), default=None)


def serialise(snoozes: dict[str, datetime]) -> dict[str, str]:
    return {eid: end.isoformat() for eid, end in sorted(snoozes.items())}


def deserialise(data: object) -> dict[str, datetime]:
    """Read stored snoozes, dropping anything malformed instead of failing the whole setup."""
    out: dict[str, datetime] = {}
    if not isinstance(data, dict):
        return out
    for eid, value in data.items():
        if not isinstance(eid, str) or not isinstance(value, str):
            continue
        try:
            end = datetime.fromisoformat(value)
        except ValueError:
            continue
        if end.tzinfo is not None:
            out[eid] = end
    return out

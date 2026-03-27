from __future__ import annotations

from datetime import date, timedelta
from typing import Optional

VALID_WINDOWS = {"30d", "90d", "all"}


def parse_iso_date(value: str | None) -> Optional[date]:
    """Parse YYYY-MM-DD into a date; return None if missing/invalid."""
    if not value:
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def normalize_window(window: str) -> str:
    """Normalize an incoming window string (trim + lowercase)."""
    return window.strip().lower()


def get_window_start_date(
    window: str, latest_record_date: date
) -> Optional[date]:
    """Convert a validated window into a start date (or None for 'all')."""
    normalized = normalize_window(window)

    if normalized == "30d":
        return latest_record_date - timedelta(days=30)
    if normalized == "90d":
        return latest_record_date - timedelta(days=90)

    # For "all" (or any other value), we don't apply a start filter.
    return None

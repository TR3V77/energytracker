"""One-off script to load neighborhoods and energy records into a fresh database.

Safe to re-run: skips a table if it already has rows.

Usage:
    DATABASE_URL=postgresql://user:pass@host:port/dbname python scripts/seed_db.py
"""
import os
from pathlib import Path

import psycopg2

DATABASE_DIR = Path(__file__).resolve().parent.parent.parent / "database"


def main():
    database_url = os.environ["DATABASE_URL"]
    conn = psycopg2.connect(database_url)
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute((DATABASE_DIR / "Tables.sql").read_text())

    cur.execute("SELECT COUNT(*) FROM neighborhoods")
    if cur.fetchone()[0] == 0:
        with open(DATABASE_DIR / "neighborhoods.csv") as f:
            next(f)  # skip header
            cur.copy_expert(
                "COPY neighborhoods (neighborhood_id, neighborhood_name, households, "
                "zip_code, latitude, longitude) FROM STDIN WITH CSV",
                f,
            )
        print("Seeded neighborhoods")
    else:
        print("neighborhoods already has data, skipping")

    cur.execute("SELECT COUNT(*) FROM energy_records")
    if cur.fetchone()[0] == 0:
        with open(DATABASE_DIR / "energy_records.csv") as f:
            next(f)  # skip header
            cur.copy_expert(
                "COPY energy_records (neighborhood_id, date, total_kwh) FROM STDIN WITH CSV",
                f,
            )
        print("Seeded energy_records")
    else:
        print("energy_records already has data, skipping")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()

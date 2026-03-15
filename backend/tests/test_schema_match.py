# backend/tests/test_schema_match.py
"""
Strict tests that verify Python SQLAlchemy models match the real database
schema defined in Tables.sql.

These exist because model/DB column mismatches (e.g. total_kwh vs
consumption_kwh) have caused repeated production crashes that are invisible
to the normal test suite, which runs against an in-memory SQLite database
created from the models themselves.
"""

import re
from pathlib import Path

import pytest
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


# Path to the canonical SQL schema
TABLES_SQL = Path(__file__).resolve().parents[2] / "database" / "Tables.sql"


def _parse_create_tables(sql_text: str) -> dict:
    """Parse Tables.sql and return {table_name: {col_name, ...}} for each
    CREATE TABLE statement."""
    tables = {}
    # Match CREATE TABLE blocks
    pattern = re.compile(
        r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\((.*?)\);",
        re.IGNORECASE | re.DOTALL,
    )
    for match in pattern.finditer(sql_text):
        table_name = match.group(1)
        body = match.group(2)
        columns = set()
        for line in body.split("\n"):
            line = line.strip().rstrip(",")
            if not line:
                continue
            # Skip standalone constraint lines (not column definitions)
            upper = line.upper()
            if any(upper.startswith(kw) for kw in [
                "CONSTRAINT", "PRIMARY KEY", "FOREIGN KEY",
                "CHECK", "UNIQUE",
            ]):
                continue
            # A column line starts with a name followed by a type keyword
            col_match = re.match(
                r"^(\w+)\s+(SERIAL|INT|INTEGER|BIGINT|SMALLINT|TEXT|VARCHAR"
                r"|CHAR|NUMERIC|DECIMAL|FLOAT|DOUBLE|REAL|BOOLEAN|DATE"
                r"|TIME|TIMESTAMP|BYTEA|JSON|JSONB)",
                line, re.IGNORECASE,
            )
            if col_match:
                columns.add(col_match.group(1).lower())
        tables[table_name.lower()] = columns
    return tables


@pytest.fixture(scope="module")
def sql_schema():
    """Load and parse Tables.sql once per test module."""
    assert TABLES_SQL.exists(), (
        f"Tables.sql not found at {TABLES_SQL}. "
        "Schema file is required for model-DB validation."
    )
    return _parse_create_tables(TABLES_SQL.read_text())


# Map each model to its expected table name
MODELS = [
    (Neighborhood, "neighborhoods"),
    (EnergyRecord, "energy_records"),
]


@pytest.mark.parametrize("model,table_name", MODELS,
                         ids=[m[1] for m in MODELS])
class TestSchemaMatch:
    """Every Python model column must exist in Tables.sql and vice versa."""

    def test_table_exists_in_sql(self, sql_schema, model, table_name):
        """The model's __tablename__ must have a CREATE TABLE in
        Tables.sql."""
        assert table_name in sql_schema, (
            f"Table '{table_name}' is defined in Python model "
            f"{model.__name__} but has no CREATE TABLE in Tables.sql"
        )

    def test_model_columns_exist_in_sql(
        self, sql_schema, model, table_name
    ):
        """Every column in the Python model must exist in
        Tables.sql."""
        if table_name not in sql_schema:
            pytest.skip(f"Table '{table_name}' not in Tables.sql")

        sql_columns = sql_schema[table_name]
        model_columns = {
            c.name.lower() for c in model.__table__.columns
        }

        missing = model_columns - sql_columns
        assert not missing, (
            f"Model {model.__name__} defines columns {missing} "
            f"that do NOT exist in Tables.sql.\n"
            f"  Model columns:  {sorted(model_columns)}\n"
            f"  Tables.sql has: {sorted(sql_columns)}"
        )

    def test_sql_columns_exist_in_model(
        self, sql_schema, model, table_name
    ):
        """Every column in Tables.sql must exist in the Python
        model."""
        if table_name not in sql_schema:
            pytest.skip(f"Table '{table_name}' not in Tables.sql")

        sql_columns = sql_schema[table_name]
        model_columns = {
            c.name.lower() for c in model.__table__.columns
        }

        missing = sql_columns - model_columns
        assert not missing, (
            f"Tables.sql defines columns {missing} for "
            f"table '{table_name}' that are NOT in Python model "
            f"{model.__name__}.\n"
            f"  Tables.sql has: {sorted(sql_columns)}\n"
            f"  Model columns:  {sorted(model_columns)}"
        )

    def test_column_sets_are_identical(
        self, sql_schema, model, table_name
    ):
        """The column sets must be exactly equal."""
        if table_name not in sql_schema:
            pytest.skip(f"Table '{table_name}' not in Tables.sql")

        sql_columns = sql_schema[table_name]
        model_columns = {
            c.name.lower() for c in model.__table__.columns
        }

        assert model_columns == sql_columns, (
            f"Column mismatch for '{table_name}'!\n"
            f"  Only in model:     "
            f"{sorted(model_columns - sql_columns)}\n"
            f"  Only in Tables.sql: "
            f"{sorted(sql_columns - model_columns)}\n"
            f"  Model columns:  {sorted(model_columns)}\n"
            f"  Tables.sql has: {sorted(sql_columns)}"
        )

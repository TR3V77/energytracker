"""Unit tests for CSV/JSON parsing and row validation in upload_service."""

import io
import json

import pytest

from app.services.upload_service import parse_csv, parse_json, validate_rows


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _bytes_stream(text: str, encoding: str = "utf-8") -> io.BytesIO:
    """Return a BytesIO stream from a string, mimicking an uploaded file."""
    return io.BytesIO(text.encode(encoding))


# ---------------------------------------------------------------------------
# parse_csv() tests
# ---------------------------------------------------------------------------

class TestParseCsv:
    def test_valid_csv_multiple_rows(self):
        csv_text = (
            "neighborhood,date,consumption_kwh\n"
            "Downtown,2024-01-01,120.5\n"
            "Uptown,2024-01-02,95.3\n"
        )
        rows = parse_csv(_bytes_stream(csv_text))
        assert len(rows) == 2
        assert rows[0] == {
            "neighborhood": "Downtown",
            "date": "2024-01-01",
            "consumption_kwh": "120.5",
        }
        assert rows[1]["neighborhood"] == "Uptown"

    def test_headers_only_returns_empty_list(self):
        csv_text = "neighborhood,date,consumption_kwh\n"
        rows = parse_csv(_bytes_stream(csv_text))
        assert rows == []

    def test_extra_columns_are_preserved(self):
        csv_text = (
            "neighborhood,date,consumption_kwh,bonus_col\n"
            "Downtown,2024-01-01,100,extra_value\n"
        )
        rows = parse_csv(_bytes_stream(csv_text))
        assert len(rows) == 1
        assert rows[0]["bonus_col"] == "extra_value"

    def test_quoted_fields_with_commas(self):
        csv_text = (
            'neighborhood,date,consumption_kwh\n'
            '"Down, Town",2024-01-01,100\n'
        )
        rows = parse_csv(_bytes_stream(csv_text))
        assert rows[0]["neighborhood"] == "Down, Town"

    def test_non_utf8_raises_unicode_error(self):
        raw = b"neighborhood,date,consumption_kwh\n\xff\xfe,2024-01-01,100\n"
        with pytest.raises(UnicodeDecodeError):
            parse_csv(io.BytesIO(raw))


# ---------------------------------------------------------------------------
# parse_json() tests
# ---------------------------------------------------------------------------

class TestParseJson:
    def test_valid_json_array(self):
        data = [
            {"neighborhood": "Downtown",
             "date": "2024-01-01",
             "consumption_kwh": 120},
        ]
        rows = parse_json(_bytes_stream(json.dumps(data)))
        assert rows == data

    def test_json_object_with_records_key(self):
        data = {
            "records": [
                {"neighborhood": "A",
                 "date": "2024-01-01",
                 "consumption_kwh": 50},
            ]
        }
        rows = parse_json(_bytes_stream(json.dumps(data)))
        assert rows == data["records"]

    def test_json_object_without_records_key_raises(self):
        data = {"items": [{"neighborhood": "A"}]}
        with pytest.raises(ValueError, match="records"):
            parse_json(_bytes_stream(json.dumps(data)))

    def test_empty_json_array(self):
        rows = parse_json(_bytes_stream("[]"))
        assert rows == []

    def test_malformed_json_raises(self):
        with pytest.raises(json.JSONDecodeError):
            parse_json(_bytes_stream("{not json"))

    def test_non_array_non_object_json_raises(self):
        for literal in ['"just a string"', "123", "true", "null"]:
            with pytest.raises(ValueError):
                parse_json(_bytes_stream(literal))


# ---------------------------------------------------------------------------
# validate_rows() tests
# ---------------------------------------------------------------------------

class TestValidateRows:
    def test_all_valid_rows(self):
        rows = [
            {"neighborhood": "A", "date": "2024-01-01",
             "consumption_kwh": "100"},
            {"neighborhood": "B", "date": "2024-01-02",
             "consumption_kwh": "200"},
        ]
        valid, errors = validate_rows(rows)
        assert len(valid) == 2
        assert errors == []

    def test_row_missing_one_field(self):
        rows = [{"neighborhood": "A", "date": "2024-01-01"}]
        valid, errors = validate_rows(rows)
        assert valid == []
        assert len(errors) == 1
        assert errors[0]["row"] == 1
        assert any("consumption_kwh" in e for e in errors[0]["errors"])

    def test_row_missing_multiple_fields(self):
        rows = [{"neighborhood": "A"}]
        valid, errors = validate_rows(rows)
        assert len(errors[0]["errors"]) == 2
        missing_fields = " ".join(errors[0]["errors"])
        assert "date" in missing_fields
        assert "consumption_kwh" in missing_fields

    def test_empty_string_treated_as_missing(self):
        rows = [{"neighborhood": "", "date": "2024-01-01",
                 "consumption_kwh": "100"}]
        valid, errors = validate_rows(rows)
        assert valid == []
        assert len(errors) == 1
        assert any("neighborhood" in e for e in errors[0]["errors"])

    def test_mix_of_valid_and_invalid(self):
        rows = [
            {"neighborhood": "A", "date": "2024-01-01",
             "consumption_kwh": "100"},
            {"date": "2024-01-02",
             "consumption_kwh": "200"},  # missing neighborhood
            {"neighborhood": "C", "date": "2024-01-03",
             "consumption_kwh": "300"},
        ]
        valid, errors = validate_rows(rows)
        assert len(valid) == 2
        assert len(errors) == 1
        assert errors[0]["row"] == 2

    def test_empty_rows_list(self):
        valid, errors = validate_rows([])
        assert valid == []
        assert errors == []

    def test_error_row_numbers_are_one_indexed(self):
        rows = [
            {"neighborhood": "A", "date": "2024-01-01",
             "consumption_kwh": "100"},
            {"neighborhood": "B"},  # row index 1 -> row number 2
            {"neighborhood": "C", "date": "2024-01-03",
             "consumption_kwh": "300"},
            {},  # row index 3 -> row number 4
        ]
        valid, errors = validate_rows(rows)
        assert len(valid) == 2
        assert len(errors) == 2
        assert errors[0]["row"] == 2
        assert errors[1]["row"] == 4

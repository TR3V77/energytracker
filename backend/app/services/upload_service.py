import csv
import io
import json
from datetime import datetime

from app.extensions import db
from app.models.neighborhood import Neighborhood
from app.models.energy_record import EnergyRecord
from app.models.upload import Upload

REQUIRED_FIELDS = ['neighborhood', 'date', 'consumption_kwh']


def parse_csv(file_stream):
    """Parse CSV file and return list of row dicts."""
    text = file_stream.read().decode('utf-8')
    reader = csv.DictReader(io.StringIO(text))
    return list(reader)


def parse_json(file_stream):
    """Parse JSON file and return list of row dicts."""
    text = file_stream.read().decode('utf-8')
    data = json.loads(text)
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and 'records' in data:
        return data['records']
    raise ValueError("JSON must be an array or an object with a 'records' key.")


def validate_rows(rows):
    """Validate that all required fields are present. Returns (valid_rows, errors)."""
    errors = []
    valid = []
    for i, row in enumerate(rows):
        row_errors = []
        for field in REQUIRED_FIELDS:
            if field not in row or not row[field]:
                row_errors.append(f"Missing required field: {field}")
        if not row_errors and row.get('consumption_kwh'):
            try:
                if float(row['consumption_kwh']) < 0:
                    row_errors.append("consumption_kwh must not be negative")
            except (ValueError, TypeError):
                pass
        if row_errors:
            errors.append({"row": i + 1, "errors": row_errors})
        else:
            valid.append(row)
    return valid, errors


def process_upload(file, filename):
    """Process an uploaded file end-to-end. Returns an Upload record."""
    ext = filename.rsplit('.', 1)[-1].lower()

    if ext == 'csv':
        rows = parse_csv(file)
    elif ext == 'json':
        rows = parse_json(file)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    valid_rows, errors = validate_rows(rows)

    upload = Upload(
        filename=filename,
        file_type=ext,
        record_count=len(valid_rows),
        status='completed' if not errors else 'partial',
        errors=json.dumps(errors) if errors else None,
    )
    db.session.add(upload)
    db.session.flush()

    for row in valid_rows:
        neighborhood = Neighborhood.query.filter_by(name=row['neighborhood']).first()
        if not neighborhood:
            neighborhood = Neighborhood(name=row['neighborhood'])
            db.session.add(neighborhood)
            db.session.flush()

        record = EnergyRecord(
            neighborhood_id=neighborhood.id,
            date=datetime.strptime(row['date'], '%Y-%m-%d').date(),
            energy_type=row.get('energy_type', 'electric') or 'electric',
            consumption_kwh=float(row['consumption_kwh']),
            renewable_kwh=float(row.get('renewable_kwh', 0) or 0),
            num_households=int(row['num_households']) if row.get('num_households') else None,
            upload_id=upload.id,
        )
        db.session.add(record)

    db.session.commit()
    return upload

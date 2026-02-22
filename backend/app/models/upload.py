from datetime import datetime
from app.extensions import db


class Upload(db.Model):
    __tablename__ = 'uploads'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(10), nullable=False)
    record_count = db.Column(db.Integer, nullable=False, default=0)
    status = db.Column(db.String(20), nullable=False, default='completed')
    errors = db.Column(db.Text, nullable=True)
    uploaded_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow
    )

    energy_records = db.relationship(
        'EnergyRecord', backref='upload', lazy=True
    )

    def __repr__(self):
        return f'<Upload {self.filename}>'

    @property
    def invalid_row_count(self):
        if self.errors:
            import json
            return len(json.loads(self.errors))
        return 0

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'file_type': self.file_type,
            'record_count': self.record_count,
            'invalid_row_count': self.invalid_row_count,
            'status': self.status,
            'errors': self.errors,
            'uploaded_at': self.uploaded_at.isoformat(),
        }

from datetime import datetime
from app.extensions import db


class EnergyRecord(db.Model):
    __tablename__ = 'energy_records'

    id = db.Column(db.Integer, primary_key=True)
    neighborhood_id = db.Column(
        db.Integer, db.ForeignKey('neighborhoods.id'), nullable=False
    )
    date = db.Column(db.Date, nullable=False)
    energy_type = db.Column(db.String(50), nullable=False, default='electric')
    consumption_kwh = db.Column(db.Float, nullable=False)
    renewable_kwh = db.Column(db.Float, nullable=True, default=0)
    num_households = db.Column(db.Integer, nullable=True)
    upload_id = db.Column(
        db.Integer, db.ForeignKey('uploads.id'), nullable=True
    )
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow
    )

    __table_args__ = (
        db.Index('ix_energy_neighborhood_date', 'neighborhood_id', 'date'),
    )

    def __repr__(self):
        return f'<EnergyRecord {self.neighborhood_id} {self.date}>'

    def to_dict(self):
        return {
            'id': self.id,
            'neighborhood_id': self.neighborhood_id,
            'date': self.date.isoformat(),
            'energy_type': self.energy_type,
            'consumption_kwh': self.consumption_kwh,
            'renewable_kwh': self.renewable_kwh,
            'num_households': self.num_households,
        }

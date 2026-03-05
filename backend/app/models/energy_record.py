from datetime import datetime

from app.extensions import db


class EnergyRecord(db.Model):
    __tablename__ = "energy_records"

    id = db.Column(db.Integer, primary_key=True)
    neighborhood_id = db.Column(
        db.Integer,
        db.ForeignKey("neighborhoods.id", ondelete="CASCADE"),
        nullable=False,
    )
    date = db.Column(db.Date, nullable=False)
    energy_type = db.Column(
        db.String(50), nullable=False, default='electric'
    )
    total_kwh = db.Column(db.Float, nullable=False)
    renewable_kwh = db.Column(db.Float, nullable=True)
    num_households = db.Column(db.Integer, nullable=True)
    upload_id = db.Column(
        db.Integer, db.ForeignKey("uploads.id"), nullable=True
    )
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow
    )

    __table_args__ = (
        db.Index("idx_energy_records_neighborhood_date", 
                 "neighborhood_id", 
                 "date"
        ),
        db.Index("idx_energy_records_date", "date"),
    )
    
    @property
    def consumption_kwh(self):
        return self.total_kwh
    
    @consumption_kwh.setter
    def consumption_kwh(self, value):
        self.total_kwh = value

    def __repr__(self):
        return {
            f'<EnergyRecord {self.neighborhood_id} {self.date} {self.total_kwh}>'
        }

    def to_dict(self):
        renewable = (
            float(self.renewable_kwh)
            if self.renewable_kwh is not None
            else None
        )
        return {
            'id': self.id,
            'neighborhood_id': self.neighborhood_id,
            'date': self.date.isoformat(),
            "energy_type": self.energy_type,
            "total_kwh": float(self.total_kwh),
            "renewable_kwh": renewable,
            "num_households": self.num_households,
            "upload_id": self.upload_id
        }

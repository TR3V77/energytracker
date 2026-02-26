from datetime import datetime
from app.extensions import db


class Neighborhood(db.Model):
    __tablename__ = 'neighborhoods'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    city = db.Column(db.String(255), nullable=False, default='Austin')
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow
    )

    energy_records = db.relationship(
        'EnergyRecord', backref='neighborhood', lazy=True
    )

    def __repr__(self):
        return f'<Neighborhood {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
        }

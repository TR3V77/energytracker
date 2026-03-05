from datetime import datetime
from app.extensions import db

class Neighborhood(db.Model):
    __tablename__ = 'neighborhoods'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    city = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<Neighborhood {self.id} {self.name} {self.city}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
        }

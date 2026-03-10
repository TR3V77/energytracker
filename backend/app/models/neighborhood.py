from app.extensions import db


class Neighborhood(db.Model):
    __tablename__ = 'neighborhoods'

    neighborhood_id = db.Column(db.Integer, primary_key=True)
    neighborhood_name = db.Column(db.Text, nullable=False)
    households = db.Column(db.Integer, nullable=False)

    energy_records = db.relationship()

    def __repr__(self):
        return f'<Neighborhood {self.id} {self.name} {self.city}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
        }

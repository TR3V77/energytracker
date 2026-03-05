from app.extensions import db

class Neighborhood(db.Model):
    __tablename__ = 'neighborhoods'

    neighborhood_id = db.Column(db.Integer, primary_key=True)
    neighborhood_name = db.Column(db.Text, nullable=False)
    households = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Neighborhood {self.neighborhood_id} {self.neighborhood_name}>'

    def to_dict(self):
        return {
            'neighborhood_id': self.neighborhood_id,
            'neighborhood_name': self.neighborhood_name,
            'households': self.households,
        }

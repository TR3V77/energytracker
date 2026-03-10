from app.extensions import db


class Neighborhood(db.Model):
    __tablename__ = 'neighborhoods'

    neighborhood_id = db.Column(db.Integer, primary_key=True)
    neighborhood_name = db.Column(db.Text, nullable=False)
    households = db.Column(db.Integer, nullable=False)

    energy_records = db.relationship(
        "EnergyRecord",
        backref = "neighborhood",
        lazy = True,
        cascade = "all, delete",
        passive_deletes = True,
    )

    def __repr__(self):
        return (
            f"<Neighborhood neighborhood_id = {self.neighborhood_id} "
            f"name = {self.neighborhood_name}>"
        )

    def to_dict(self):
        return {
            "neighborhood_id": self.neighborhood_id,
            "neighborhood_name": self.neighborhood_name,
            "households": self.households,
        }

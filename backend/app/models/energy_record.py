from app.extensions import db


class EnergyRecord(db.Model):
    __tablename__ = "energy_records"

    id = db.Column(db.Integer, primary_key=True)
    neighborhood_id = db.Column(
        db.Integer,
        db.ForeignKey("neighborhoods.neighborhood_id", ondelete="CASCADE"),
        nullable=False,
    )
    date = db.Column(db.Date, nullable=False)
    total_kwh = db.Column(db.Float, nullable=False)

    __table_args__ = (
        db.Index(
            "idx_energy_records_neighborhood_date",
            "neighborhood_id",
            "date",
        ),
        db.Index("idx_energy_records_date", "date"),
    )

    def __repr__(self):
        return (
            f"<EnergyRecord neighborhood_id = {self.neighborhood_id} "
            f"date = {self.date} total_kwh = {self.total_kwh}>"
        )

    def to_dict(self):
        return {
            "id": self.id,
            "neighborhood_id": self.neighborhood_id,
            "date": self.date.isoformat(),
            "total_kwh": float(self.total_kwh),
        }

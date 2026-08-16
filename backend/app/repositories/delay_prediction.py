from sqlalchemy.orm import Session

from app.models.delay_prediction import DelayPrediction


class DelayPredictionRepository:

    @staticmethod
    def create(
        db: Session,
        obj: DelayPrediction,
    ):

        db.add(obj)

        db.commit()

        db.refresh(obj)

        return obj

    @staticmethod
    def get(
        db: Session,
        prediction_id: str,
    ):

        return (
            db.query(DelayPrediction)
            .filter(
                DelayPrediction.id == prediction_id
            )
            .first()
        )

    @staticmethod
    def get_multi(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):

        return (
            db.query(DelayPrediction)
            .offset(skip)
            .limit(limit)
            .all()
        )
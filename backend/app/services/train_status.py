from sqlalchemy.orm import Session

from app.models.train import Train
from app.models.station import Station
from app.models.occupancy import Occupancy

from app.schemas.train_status import TrainStatusResponse


class TrainStatusService:

    @staticmethod
    def get_all_trains(db: Session):

        # =====================================================
        # Get all trains + current station
        # =====================================================

        rows = (
            db.query(
                Train,
                Station.station_name.label("current_station"),
            )
            .outerjoin(
                Station,
                Train.current_station_id == Station.id,
            )
            .order_by(
                Train.train_number
            )
            .all()
        )

        trains = []

        # =====================================================
        # Process every train
        # =====================================================

        for train, current_station in rows:

            # =================================================
            # Train Status
            # =================================================

            if hasattr(train.status, "value"):
                status = train.status.value
            else:
                status = str(train.status)

            status = status.upper()

            # =================================================
            # Recommendation
            # =================================================

            if status == "ACTIVE":

                recommendation = (
                    "Train is operating normally."
                )

            elif status == "MAINTENANCE":

                recommendation = (
                    "Train is under maintenance "
                    "and should not be deployed."
                )

            elif status == "OUT_OF_SERVICE":

                recommendation = (
                    "Train is out of service "
                    "and unavailable for operation."
                )

            else:

                recommendation = (
                    "Train status requires verification."
                )

            # =================================================
            # Get Latest Occupancy
            # =================================================

            latest_occupancy = (
                db.query(Occupancy)
                .filter(
                    Occupancy.train_id == train.id
                )
                .order_by(
                    Occupancy.timestamp.desc()
                )
                .first()
            )

            # =================================================
            # Occupancy Percentage
            # =================================================

            occupancy_percentage = None

            if latest_occupancy is not None:

                if (
                    latest_occupancy.occupancy_percentage
                    is not None
                ):

                    occupancy_percentage = round(
                        float(
                            latest_occupancy.occupancy_percentage
                        ),
                        2,
                    )

            # =================================================
            # Health
            # =================================================

            # No health column exists in the database.
            # Therefore, do not generate a fake health score.

            health_score = None

            # =================================================
            # Last Updated
            # =================================================

            if latest_occupancy is not None:

                if latest_occupancy.timestamp:

                    last_updated = (
                        latest_occupancy
                        .timestamp
                        .isoformat()
                    )

                else:

                    last_updated = "No data"

            elif train.updated_at:

                last_updated = (
                    train.updated_at.isoformat()
                )

            elif train.created_at:

                last_updated = (
                    train.created_at.isoformat()
                )

            else:

                last_updated = "No data"

            # =================================================
            # Build Response
            # =================================================

            trains.append(

                TrainStatusResponse(

                    # -----------------------------------------
                    # Train Information
                    # -----------------------------------------

                    train_number=str(
                        train.train_number
                    ),

                    train_name=str(
                        train.train_name
                    ),

                    line=str(
                        train.line
                    ),

                    capacity=int(
                        train.capacity
                    ),

                    # -----------------------------------------
                    # Current Station
                    # -----------------------------------------

                    current_station=(
                        current_station
                        if current_station
                        else "Not Assigned"
                    ),

                    # -----------------------------------------
                    # Status
                    # -----------------------------------------

                    status=status,

                    # -----------------------------------------
                    # Technical Information
                    # -----------------------------------------

                    speed_limit_kmh=(
                        int(
                            train.speed_limit_kmh
                        )
                        if train.speed_limit_kmh
                        is not None
                        else None
                    ),

                    manufacturer=(
                        str(
                            train.manufacturer
                        )
                        if train.manufacturer
                        else "Unknown"
                    ),

                    model=(
                        str(
                            train.model
                        )
                        if train.model
                        else "Unknown"
                    ),

                    year_of_manufacture=(
                        int(
                            train.year_of_manufacture
                        )
                        if train.year_of_manufacture
                        is not None
                        else None
                    ),

                    # -----------------------------------------
                    # Dashboard Information
                    # -----------------------------------------

                    health_score=health_score,

                    occupancy_percentage=(
                        occupancy_percentage
                    ),

                    recommendation=(
                        recommendation
                    ),

                    last_updated=(
                        last_updated
                    ),
                )
            )

        return trains
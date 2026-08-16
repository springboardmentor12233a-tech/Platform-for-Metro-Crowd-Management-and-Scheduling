from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.operations_dashboard import (
    OperationsDashboardResponse,
    CriticalStation,
)


class OperationsDashboardService:

    @staticmethod
    def dashboard(db: Session):

        # ============================================================
        # TRAIN STATISTICS
        # ============================================================

        train_stats = db.execute(
            text(
                """
                SELECT
                    COUNT(*) AS total_trains,
                    COUNT(*) FILTER (
                        WHERE LOWER(status::text) = 'running'
                    ) AS running_trains,
                    COUNT(*) FILTER (
                        WHERE LOWER(status::text) = 'idle'
                    ) AS idle_trains,
                    COUNT(*) FILTER (
                        WHERE LOWER(status::text) = 'maintenance'
                    ) AS maintenance_trains
                FROM trains
                """
            )
        ).mappings().one()

        total_trains = int(
            train_stats["total_trains"] or 0
        )

        running_trains = int(
            train_stats["running_trains"] or 0
        )

        idle_trains = int(
            train_stats["idle_trains"] or 0
        )

        maintenance_trains = int(
            train_stats["maintenance_trains"] or 0
        )

        # ============================================================
        # DELAY STATISTICS
        # ============================================================

        delay_stats = db.execute(
            text(
                """
                SELECT
                    COUNT(*) AS total_predictions,

                    COUNT(*) FILTER (
                        WHERE predicted_delay_minutes > 5
                    ) AS delayed_predictions,

                    COALESCE(
                        AVG(predicted_delay_minutes),
                        0
                    ) AS average_delay

                FROM delay_predictions
                """
            )
        ).mappings().one()

        delayed_trains = int(
            delay_stats["delayed_predictions"] or 0
        )

        average_delay = round(
            float(
                delay_stats["average_delay"] or 0
            ),
            2,
        )

        # ============================================================
        # HIGH CROWD STATIONS
        # ============================================================

        high_crowd_result = db.execute(
            text(
                """
                SELECT COUNT(*)
                FROM (
                    SELECT DISTINCT ON (cp.station_id)
                        cp.station_id,
                        cp.predicted_crowd_level
                    FROM crowd_predictions cp
                    ORDER BY
                        cp.station_id,
                        cp.prediction_time DESC
                ) latest
                WHERE UPPER(
                    latest.predicted_crowd_level::text
                ) IN ('HIGH', 'VERY_HIGH')
                """
            )
        ).scalar()

        high_crowd_stations = int(
            high_crowd_result or 0
        )

        # ============================================================
        # LATEST CROWD PREDICTION PER STATION
        # ============================================================

        critical_rows = db.execute(
            text(
                """
                SELECT
                    latest.station_id,
                    s.station_name,

                    latest.predicted_entries,
                    latest.predicted_exits,
                    latest.predicted_platform_crowd,
                    latest.predicted_crowd_level,
                    latest.confidence_score,
                    latest.prediction_time

                FROM (
                    SELECT DISTINCT ON (station_id)
                        station_id,
                        predicted_entries,
                        predicted_exits,
                        predicted_platform_crowd,
                        predicted_crowd_level,
                        confidence_score,
                        prediction_time

                    FROM crowd_predictions

                    ORDER BY
                        station_id,
                        prediction_time DESC
                ) latest

                INNER JOIN stations s
                    ON s.id = latest.station_id

                ORDER BY
                    latest.predicted_platform_crowd DESC NULLS LAST,
                    latest.predicted_entries DESC NULLS LAST

                LIMIT 5
                """
            )
        ).mappings().all()

        # ============================================================
        # LATEST DELAY PREDICTION
        # ============================================================

        latest_delay = db.execute(
            text(
                """
                SELECT
                    predicted_delay_minutes,
                    delay_level,
                    prediction_time,
                    route_id,
                    transport_type

                FROM delay_predictions

                ORDER BY prediction_time DESC

                LIMIT 1
                """
            )
        ).mappings().first()

        if latest_delay:

            latest_delay_minutes = int(
                round(
                    float(
                        latest_delay[
                            "predicted_delay_minutes"
                        ] or 0
                    )
                )
            )

            latest_delay_level = str(
                latest_delay[
                    "delay_level"
                ]
                or "Unknown"
            )

        else:

            latest_delay_minutes = 0
            latest_delay_level = "Unknown"

        # ============================================================
        # CRITICAL STATIONS
        # ============================================================

        critical_stations = []

        for row in critical_rows:

            station_name = str(
                row["station_name"]
            )

            crowd_level = str(
                row["predicted_crowd_level"]
                or "Unknown"
            )

            predicted_entries = int(
                row["predicted_entries"]
                or 0
            )

            predicted_exits = int(
                row["predicted_exits"]
                or 0
            )

            platform_crowd = int(
                row["predicted_platform_crowd"]
                or 0
            )

            # --------------------------------------------------------
            # Recommendation
            # --------------------------------------------------------

            normalized_crowd = (
                crowd_level
                .upper()
                .replace(" ", "_")
            )

            if normalized_crowd == "VERY_HIGH":

                recommendation = (
                    "Increase train frequency and "
                    "prioritize crowd control."
                )

            elif normalized_crowd == "HIGH":

                recommendation = (
                    "Consider additional train frequency "
                    "and monitor platform crowding."
                )

            elif normalized_crowd == "MEDIUM":

                recommendation = (
                    "Maintain current service and "
                    "continue monitoring passenger flow."
                )

            elif normalized_crowd == "LOW":

                recommendation = (
                    "Current passenger demand is manageable."
                )

            else:

                recommendation = (
                    "Continue monitoring station conditions."
                )

            # --------------------------------------------------------
            # Include latest DB delay information
            # --------------------------------------------------------

            if latest_delay_minutes > 5:

                recommendation += (
                    f" Latest system delay prediction is "
                    f"{latest_delay_minutes} minutes."
                )

            critical_stations.append(
                CriticalStation(
                    station_name=station_name,

                    crowd_level=crowd_level,

                    predicted_delay=latest_delay_minutes,

                    recommendation=recommendation,
                )
            )

        # ============================================================
        # FINAL RESPONSE
        # ============================================================

        return OperationsDashboardResponse(

            total_trains=total_trains,

            running_trains=running_trains,

            idle_trains=idle_trains,

            maintenance_trains=maintenance_trains,

            delayed_trains=delayed_trains,

            average_delay=average_delay,

            high_crowd_stations=high_crowd_stations,

            critical_stations=critical_stations,
        )
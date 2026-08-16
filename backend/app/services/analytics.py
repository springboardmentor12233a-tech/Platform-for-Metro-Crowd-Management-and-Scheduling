from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.crowd_prediction import CrowdPrediction
from app.models.ridership_prediction import RidershipPrediction
from app.models.delay_prediction import DelayPrediction
from app.models.frequency_adjustment import FrequencyAdjustment
from app.models.station import Station


class AnalyticsService:

    @staticmethod
    def get_prediction_analytics(db: Session):

        # =====================================================
        # CROWD PREDICTIONS
        # =====================================================

        crowd_rows = (
            db.query(
                CrowdPrediction,
                Station.station_name,
            )
            .join(
                Station,
                CrowdPrediction.station_id == Station.id,
            )
            .order_by(
                CrowdPrediction.prediction_time.desc()
            )
            .all()
        )

        crowd = []

        for prediction, station_name in crowd_rows:

            crowd_level = prediction.predicted_crowd_level

            if hasattr(crowd_level, "value"):
                crowd_level = crowd_level.value

            crowd.append({
                "id": prediction.id,
                "type": "Crowd",
                "station_name": station_name,
                "prediction_time": (
                    prediction.prediction_time.isoformat()
                    if prediction.prediction_time
                    else None
                ),
                "predicted_entries": (
                    prediction.predicted_entries
                ),
                "predicted_exits": (
                    prediction.predicted_exits
                ),
                "predicted_crowd_level": crowd_level,
                "confidence_score": (
                    prediction.confidence_score
                ),
            })

        # =====================================================
        # RIDERSHIP PREDICTIONS
        # =====================================================

        ridership_rows = (
            db.query(
                RidershipPrediction,
                Station.station_name,
            )
            .join(
                Station,
                RidershipPrediction.station_id == Station.id,
            )
            .order_by(
                RidershipPrediction.prediction_time.desc()
            )
            .all()
        )

        ridership = []

        for prediction, station_name in ridership_rows:

            ridership.append({
                "id": prediction.id,
                "type": "Ridership",
                "station_name": station_name,
                "prediction_time": (
                    prediction.prediction_time.isoformat()
                    if prediction.prediction_time
                    else None
                ),
                "predicted_entries": (
                    prediction.predicted_entry_count
                ),
                "predicted_exits": (
                    prediction.predicted_exit_count
                ),
                "prediction": (
                    prediction.predicted_entry_count
                ),
                "confidence_score": None,
            })

        # =====================================================
        # FREQUENCY ADJUSTMENTS
        # =====================================================

        frequency_rows = (
            db.query(
                FrequencyAdjustment,
                Station.station_name,
            )
            .join(
                Station,
                FrequencyAdjustment.station_id == Station.id,
            )
            .order_by(
                FrequencyAdjustment.created_at.desc()
            )
            .all()
        )

        frequency = []

        for prediction, station_name in frequency_rows:

            frequency.append({
                "id": str(prediction.id),
                "type": "Frequency",
                "station_name": station_name,
                "prediction_time": (
                    prediction.created_at.isoformat()
                    if prediction.created_at
                    else None
                ),
                "occupancy": prediction.occupancy,
                "capacity": prediction.capacity,
                "occupancy_percentage": (
                    prediction.occupancy_percentage
                ),
                "current_frequency": (
                    prediction.current_frequency
                ),
                "recommended_frequency": (
                    prediction.recommended_frequency
                ),
                "frequency_action": (
                    prediction.frequency_action
                ),
                "action_code": prediction.action_code,
                "additional_trains_required": (
                    prediction.additional_trains_required
                ),
                "priority": prediction.priority,
                "action_required": (
                    prediction.action_required
                ),
                "recommendation": prediction.recommendation,
                "reason": prediction.reason,
                "estimated_wait_time_impact": (
                    prediction.estimated_wait_time_impact
                ),
                "confidence_score": None,
            })

        # =====================================================
        # DELAY PREDICTIONS
        # =====================================================

        delay_rows = (
            db.query(DelayPrediction)
            .order_by(
                DelayPrediction.prediction_time.desc()
            )
            .all()
        )

        delay = []

        for prediction in delay_rows:

            delay.append({
                "id": prediction.id,
                "type": "Delay",
                "station_name": None,
                "route_id": prediction.route_id,
                "transport_type": prediction.transport_type,
                "prediction_time": (
                    prediction.prediction_time.isoformat()
                    if prediction.prediction_time
                    else None
                ),
                "predicted_delay": (
                    prediction.predicted_delay_minutes
                ),
                "predicted_delay_minutes": (
                    prediction.predicted_delay_minutes
                ),
                "delay_level": prediction.delay_level,
                "confidence_score": (
                    prediction.confidence_score
                ),
            })

        # =====================================================
        # SCHEDULE PREDICTIONS
        # =====================================================
        #
        # We use SQL here because the schedule_predictions
        # table has just been added and this avoids depending
        # on the exact Python model filename/class name.
        #

        schedule_rows = db.execute(
            text(
                """
                SELECT
                    sp.id,
                    sp.station_id,
                    s.station_name,
                    sp.prediction_time,
                    sp.train_id,
                    sp.schedule_action,
                    sp.action_code,
                    sp.reschedule_required,
                    sp.current_departure_time,
                    sp.recommended_departure_time,
                    sp.current_platform,
                    sp.recommended_platform,
                    sp.predicted_passengers,
                    sp.crowd_level,
                    sp.current_frequency,
                    sp.recommended_frequency,
                    sp.delay_minutes,
                    sp.train_to_allocate,
                    sp.recommendation,
                    sp.reason
                FROM schedule_predictions sp
                LEFT JOIN stations s
                    ON sp.station_id = s.id
                ORDER BY
                    sp.prediction_time DESC
                """
            )
        ).mappings().all()

        schedule = []

        for prediction in schedule_rows:

            schedule.append({
                "id": prediction["id"],
                "type": "Schedule",
                "station_name": (
                    prediction["station_name"]
                ),
                "prediction_time": (
                    prediction["prediction_time"].isoformat()
                    if prediction["prediction_time"]
                    else None
                ),
                "train_id": prediction["train_id"],
                "schedule_action": (
                    prediction["schedule_action"]
                ),
                "action_code": prediction["action_code"],
                "reschedule_required": (
                    prediction["reschedule_required"]
                ),
                "current_departure_time": (
                    prediction["current_departure_time"]
                ),
                "recommended_departure_time": (
                    prediction[
                        "recommended_departure_time"
                    ]
                ),
                "current_platform": (
                    prediction["current_platform"]
                ),
                "recommended_platform": (
                    prediction["recommended_platform"]
                ),
                "predicted_passengers": (
                    prediction["predicted_passengers"]
                ),
                "crowd_level": (
                    prediction["crowd_level"]
                ),
                "current_frequency": (
                    prediction["current_frequency"]
                ),
                "recommended_frequency": (
                    prediction["recommended_frequency"]
                ),
                "delay_minutes": (
                    prediction["delay_minutes"]
                ),
                "train_to_allocate": (
                    prediction["train_to_allocate"]
                ),
                "recommendation": (
                    prediction["recommendation"]
                ),
                "reason": prediction["reason"],
                "confidence_score": None,
            })

        # =====================================================
        # FINAL RESPONSE
        # =====================================================

        return {
            "crowd": crowd,
            "ridership": ridership,
            "frequency": frequency,
            "delay": delay,
            "schedule": schedule,
        }
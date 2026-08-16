from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.session import get_db


router = APIRouter()


@router.get("/predictions")
def get_prediction_analytics(
    db: Session = Depends(get_db),
):
    # =========================================================
    # CROWD PREDICTIONS
    # =========================================================

    crowd_query = text("""
        SELECT
            cp.id,
            'Crowd' AS type,
            s.station_name,
            cp.prediction_time,
            cp.predicted_entries,
            cp.predicted_exits,
            cp.predicted_crowd_level,
            cp.confidence_score
        FROM crowd_predictions cp
        LEFT JOIN stations s
            ON cp.station_id = s.id
        ORDER BY cp.prediction_time DESC
    """)

    crowd_rows = db.execute(crowd_query).mappings().all()

    crowd = [
        {
            "id": row["id"],
            "type": "Crowd",
            "station_name": row["station_name"],
            "prediction_time": row["prediction_time"],
            "predicted_entries": row["predicted_entries"],
            "predicted_exits": row["predicted_exits"],
            "predicted_crowd_level": (
                str(row["predicted_crowd_level"])
                if row["predicted_crowd_level"] is not None
                else None
            ),
            "confidence_score": row["confidence_score"],
        }
        for row in crowd_rows
    ]

    # =========================================================
    # RIDERSHIP PREDICTIONS
    # =========================================================

    ridership_query = text("""
        SELECT
            rp.id,
            'Ridership' AS type,
            s.station_name,
            rp.prediction_time,
            rp.predicted_entries,
            rp.predicted_exits,
            rp.prediction,
            rp.confidence_score
        FROM ridership_predictions rp
        LEFT JOIN stations s
            ON rp.station_id = s.id
        ORDER BY rp.prediction_time DESC
    """)

    ridership_rows = (
        db.execute(ridership_query)
        .mappings()
        .all()
    )

    ridership = [
        {
            "id": row["id"],
            "type": "Ridership",
            "station_name": row["station_name"],
            "prediction_time": row["prediction_time"],
            "predicted_entries": row["predicted_entries"],
            "predicted_exits": row["predicted_exits"],
            "prediction": row["prediction"],
            "confidence_score": row["confidence_score"],
        }
        for row in ridership_rows
    ]

    # =========================================================
    # FREQUENCY ADJUSTMENTS
    # =========================================================

    frequency_query = text("""
        SELECT
            fa.id,
            'Frequency' AS type,
            s.station_name,
            fa.prediction_time,
            fa.occupancy,
            fa.capacity,
            fa.occupancy_percentage,
            fa.current_frequency,
            fa.recommended_frequency,
            fa.frequency_action,
            fa.action_code,
            fa.additional_trains_required,
            fa.priority,
            fa.action_required,
            fa.recommendation,
            fa.reason,
            fa.estimated_wait_time_impact
        FROM frequency_adjustments fa
        LEFT JOIN stations s
            ON fa.station_id = s.id
        ORDER BY fa.prediction_time DESC
    """)

    frequency_rows = (
        db.execute(frequency_query)
        .mappings()
        .all()
    )

    frequency = [
        {
            "id": row["id"],
            "type": "Frequency",
            "station_name": row["station_name"],
            "prediction_time": row["prediction_time"],
            "occupancy": row["occupancy"],
            "capacity": row["capacity"],
            "occupancy_percentage": row[
                "occupancy_percentage"
            ],
            "current_frequency": row[
                "current_frequency"
            ],
            "recommended_frequency": row[
                "recommended_frequency"
            ],
            "frequency_action": row[
                "frequency_action"
            ],
            "action_code": row["action_code"],
            "additional_trains_required": row[
                "additional_trains_required"
            ],
            "priority": row["priority"],
            "action_required": row[
                "action_required"
            ],
            "recommendation": row[
                "recommendation"
            ],
            "reason": row["reason"],
            "estimated_wait_time_impact": row[
                "estimated_wait_time_impact"
            ],
        }
        for row in frequency_rows
    ]

    # =========================================================
    # DELAY PREDICTIONS
    # =========================================================

    delay_query = text("""
        SELECT
            dp.id,
            'Delay' AS type,
            dp.route_id,
            dp.transport_type,
            dp.prediction_time,
            dp.predicted_delay_minutes,
            dp.delay_level,
            dp.confidence_score
        FROM delay_predictions dp
        ORDER BY dp.prediction_time DESC
    """)

    delay_rows = (
        db.execute(delay_query)
        .mappings()
        .all()
    )

    delay = [
        {
            "id": row["id"],
            "type": "Delay",
            "station_name": None,
            "route_id": row["route_id"],
            "transport_type": row[
                "transport_type"
            ],
            "prediction_time": row[
                "prediction_time"
            ],
            "predicted_delay": row[
                "predicted_delay_minutes"
            ],
            "predicted_delay_minutes": row[
                "predicted_delay_minutes"
            ],
            "delay_level": row[
                "delay_level"
            ],
            "confidence_score": row[
                "confidence_score"
            ],
        }
        for row in delay_rows
    ]

    # =========================================================
    # SCHEDULE PREDICTIONS
    # =========================================================

    schedule_query = text("""
        SELECT
            sp.id,
            'Schedule' AS type,
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
        ORDER BY sp.prediction_time DESC
    """)

    schedule_rows = (
        db.execute(schedule_query)
        .mappings()
        .all()
    )

    schedule = [
        {
            "id": row["id"],
            "type": "Schedule",
            "station_name": row[
                "station_name"
            ],
            "prediction_time": row[
                "prediction_time"
            ],
            "train_id": row[
                "train_id"
            ],
            "schedule_action": row[
                "schedule_action"
            ],
            "action_code": row[
                "action_code"
            ],
            "reschedule_required": row[
                "reschedule_required"
            ],
            "current_departure_time": row[
                "current_departure_time"
            ],
            "recommended_departure_time": row[
                "recommended_departure_time"
            ],
            "current_platform": row[
                "current_platform"
            ],
            "recommended_platform": row[
                "recommended_platform"
            ],
            "predicted_passengers": row[
                "predicted_passengers"
            ],
            "crowd_level": (
                str(row["crowd_level"])
                if row["crowd_level"] is not None
                else None
            ),
            "current_frequency": row[
                "current_frequency"
            ],
            "recommended_frequency": row[
                "recommended_frequency"
            ],
            "delay_minutes": row[
                "delay_minutes"
            ],
            "train_to_allocate": row[
                "train_to_allocate"
            ],
            "recommendation": row[
                "recommendation"
            ],
            "reason": row[
                "reason"
            ],
        }
        for row in schedule_rows
    ]

    # =========================================================
    # FINAL RESPONSE
    # =========================================================

    return {
        "crowd": crowd,
        "ridership": ridership,
        "frequency": frequency,
        "delay": delay,
        "schedule": schedule,
    }
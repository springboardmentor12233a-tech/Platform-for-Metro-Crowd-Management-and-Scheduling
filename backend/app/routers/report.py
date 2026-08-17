from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import PredictionHistory, MetroAlert
from app.services.report_service import generate_report_analysis
from app.services.pdf_service import create_pdf_report
from fastapi.responses import FileResponse
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/report",
    tags=["Reports"]
)


@router.get("/generate")
def generate_report(db: Session = Depends(get_db),current_user = Depends(get_current_user)):

    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only administrators can generate reports"
        )

    # Total Predictions
    total_predictions = (
        db.query(PredictionHistory)
        .count()
    )
    # Average Predicted Passengers 
    average_passengers = (
        db.query(
            func.avg(
                PredictionHistory.predicted_passengers
            )
        )
        .scalar()
    )

    # High Priority Alerts
    high_alerts = (
        db.query(MetroAlert)
        .filter(
            MetroAlert.priority == "HIGH"
        )
        .count()
    )

    # -----------------------------
    # Busiest Route
    # -----------------------------
    busiest_route = (
        db.query(
            PredictionHistory.from_station,
            PredictionHistory.to_station,
            func.sum(
                PredictionHistory.predicted_passengers
            ).label("total_passengers")
        )
        .group_by(
            PredictionHistory.from_station,
            PredictionHistory.to_station
        )
        .order_by(
            func.sum(
                PredictionHistory.predicted_passengers
            ).desc()
        )
        .first()
    )

    # -----------------------------
    # Latest Prediction
    # -----------------------------
    latest_prediction = (
        db.query(PredictionHistory)
        .order_by(
            PredictionHistory.prediction_time.desc()
        )
        .first()
    )

    # -----------------------------
    # Data sent to Gemini
    # -----------------------------
    report_data = {

        "total_predictions": total_predictions,

        "average_passengers":
            float(round(average_passengers, 2))
            if average_passengers else 0,

        "high_alerts": high_alerts,

        "busiest_route":
            (
                f"{busiest_route.from_station} → {busiest_route.to_station}"
                if busiest_route else "N/A"
            ),

        "current_crowd_level":
            latest_prediction.crowd_level
            if latest_prediction else "N/A",

        "platform_status":
            latest_prediction.platform_status
            if latest_prediction else "N/A",

        "recommended_train_interval":
            latest_prediction.recommended_train_interval
            if latest_prediction else "N/A",

        "extra_trains":
            latest_prediction.extra_trains
            if latest_prediction else 0
    }

    ai_report = generate_report_analysis(report_data)
    recent_predictions = (
    db.query(PredictionHistory)
    .order_by(PredictionHistory.prediction_time.desc())
    .limit(5)
    .all()
)
    pdf_path = create_pdf_report(
        statistics=report_data,
        ai_report=ai_report,
        predictions=recent_predictions
    )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename="MetroFlow_Report.pdf"
    )
    
   

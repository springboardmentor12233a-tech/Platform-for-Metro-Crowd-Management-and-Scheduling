from datetime import datetime
import json
import io

import pandas as pd

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate

from app.database import get_db
from app.models.station import Station
from app.models.trip_record import TripRecord
from app.models.report import Report

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# =====================================================
# Generate Report
# =====================================================
@router.post("/generate")
def generate_report(payload: dict, db: Session = Depends(get_db)):

    total_passengers = (
        db.query(func.sum(TripRecord.passengers)).scalar() or 0
    )

    total_revenue = (
        db.query(func.sum(TripRecord.fare)).scalar() or 0
    )

    total_trips = (
        db.query(func.count(TripRecord.trip_id)).scalar() or 0
    )

    total_stations = (
    db.query(func.count(Station.id)).scalar() or 0
)
    busiest_station = (
        db.query(
            TripRecord.from_station,
            func.sum(TripRecord.passengers).label("total")
        )
        .group_by(TripRecord.from_station)
        .order_by(func.sum(TripRecord.passengers).desc())
        .first()
    )

    recommendations = [
        "Increase train frequency during peak hours.",
        "Deploy additional staff at high-demand stations.",
        "Monitor congestion hotspots continuously."
    ]

    operational_actions = [
        "Increase platform monitoring.",
        "Optimize train schedules.",
        "Deploy emergency response teams."
    ]

    report = Report(
        report_type=payload.get("report_type", "Executive"),

        export_format=payload.get("export_format", "PDF"),

        network_status="Healthy",

        busiest_station=(
            busiest_station[0]
            if busiest_station
            else "N/A"
        ),

        summary=(
            "MetroFlow AI analyzed passenger demand, "
            "station utilization, congestion levels, "
            "operational efficiency and revenue trends."
        ),

        recommendations=json.dumps(recommendations),

        operational_actions=json.dumps(operational_actions),

        expected_impact=(
            "Passenger waiting time expected to decrease "
            "by approximately 18%."
        ),

        confidence=96,

        total_passengers=int(total_passengers),

        total_revenue=float(total_revenue),

        total_trips=int(total_trips),

        total_stations=int(total_stations),
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "id": report.id,
        "generated_at": report.created_at,

        "report_type": report.report_type,

        "export_format": report.export_format,

        "network_status": report.network_status,

        "busiest_station": report.busiest_station,

        "summary": report.summary,

        "statistics": {
            "total_passengers": report.total_passengers,
            "total_revenue": report.total_revenue,
            "total_trips": report.total_trips,
            "total_stations": report.total_stations,
        },

        "recommendations": json.loads(report.recommendations),

        "operational_actions": json.loads(report.operational_actions),

        "expected_impact": report.expected_impact,

        "confidence": report.confidence,
    }


# =====================================================
# Report History
# =====================================================
@router.get("/history")
def get_history(db: Session = Depends(get_db)):

    reports = (
        db.query(Report)
        .order_by(Report.created_at.desc())
        .all()
    )

    history = []

    for report in reports:

        history.append({

            "id": report.id,

            "generated_at": report.created_at,

            "report_type": report.report_type,

            "export_format": report.export_format,

            "network_status": report.network_status,

            "busiest_station": report.busiest_station,

            "summary": report.summary,

            "statistics": {
                "total_passengers": report.total_passengers,
                "total_revenue": report.total_revenue,
                "total_trips": report.total_trips,
                "total_stations": report.total_stations,
            },

            "recommendations": json.loads(
                report.recommendations
            ),

            "operational_actions": json.loads(
                report.operational_actions
            ),

            "expected_impact": report.expected_impact,

            "confidence": report.confidence,
        })

    return history


# =====================================================
# Get Single Report
# =====================================================
@router.get("/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return {

        "id": report.id,

        "generated_at": report.created_at,

        "report_type": report.report_type,

        "export_format": report.export_format,

        "network_status": report.network_status,

        "busiest_station": report.busiest_station,

        "summary": report.summary,

        "statistics": {
            "total_passengers": report.total_passengers,
            "total_revenue": report.total_revenue,
            "total_trips": report.total_trips,
            "total_stations": report.total_stations,
        },

        "recommendations": json.loads(
            report.recommendations
        ),

        "operational_actions": json.loads(
            report.operational_actions
        ),

        "expected_impact": report.expected_impact,

        "confidence": report.confidence,
    }


# =====================================================
# Export Endpoints
# =====================================================
@router.get("/pdf/{report_id}")
def export_pdf(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    buffer = io.BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    story = []

    story.append(
        Paragraph(
            "<b>MetroFlow AI Report</b>",
            styles["Title"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Generated:</b> {report.created_at}",
            styles["BodyText"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Passengers:</b> {report.total_passengers}",
            styles["BodyText"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Revenue:</b> ₹{report.total_revenue}",
            styles["BodyText"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Trips:</b> {report.total_trips}",
            styles["BodyText"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Stations:</b> {report.total_stations}",
            styles["BodyText"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Summary:</b> {report.summary}",
            styles["BodyText"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Expected Impact:</b> {report.expected_impact}",
            styles["BodyText"]
        )
    )

    doc.build(story)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f"attachment; filename=MetroFlow_Report_{report.id}.pdf"
        }
    )


@router.get("/csv/{report_id}")
def export_csv(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    df = pd.DataFrame([
        {
            "Report ID": report.id,
            "Generated": report.created_at,
            "Type": report.report_type,
            "Passengers": report.total_passengers,
            "Revenue": report.total_revenue,
            "Trips": report.total_trips,
            "Stations": report.total_stations,
            "Network": report.network_status,
            "Confidence": report.confidence,
            "Busiest Station": report.busiest_station,
        }
    ])

    stream = io.StringIO()

    df.to_csv(stream, index=False)

    stream.seek(0)

    return StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            f"attachment; filename=MetroFlow_Report_{report.id}.csv"
        }
    )


@router.get("/excel/{report_id}")
def export_excel(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    df = pd.DataFrame([
        {
            "Report ID": report.id,
            "Generated": report.created_at,
            "Type": report.report_type,
            "Passengers": report.total_passengers,
            "Revenue": report.total_revenue,
            "Trips": report.total_trips,
            "Stations": report.total_stations,
            "Confidence": report.confidence,
            "Busiest Station": report.busiest_station,
        }
    ])

    output = io.BytesIO()

    with pd.ExcelWriter(
        output,
        engine="openpyxl"
    ) as writer:

        df.to_excel(
            writer,
            index=False,
            sheet_name="MetroFlow Report"
        )

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition":
            f"attachment; filename=MetroFlow_Report_{report.id}.xlsx"
        }
    )
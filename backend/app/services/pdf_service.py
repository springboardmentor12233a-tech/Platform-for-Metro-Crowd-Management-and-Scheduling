from datetime import datetime

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch


def create_pdf_report(statistics, ai_report, predictions):

    pdf_path = "MetroFlow_Report.pdf"

    doc = SimpleDocTemplate(pdf_path)

    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    title_style.alignment = TA_CENTER
    title_style.textColor = colors.darkblue

    heading_style = styles["Heading2"]

    normal_style = styles["BodyText"]

    story = []

    # ---------------------------------------------------
    # Title
    # ---------------------------------------------------

    story.append(
        Paragraph(
            "MetroFlow AI",
            title_style
        )
    )

    story.append(
        Paragraph(
            "Operational Traffic Analysis Report",
            heading_style
        )
    )

    story.append(
        Paragraph(
            "AI Powered Metro Crowd Management System",
            normal_style
        )
    )

    story.append(
    Spacer(1, 0.15 * inch)
)


    story.append(
     Paragraph(
        f"Generated On: {datetime.now().strftime('%d %B %Y')}",
        normal_style
    )
)

    # ---------------------------------------------------
    # Executive Summary
    # ---------------------------------------------------

    story.append(
        Paragraph(
            "1. Executive Summary",
            heading_style
        )
    )

    story.append(
        Paragraph(
            ai_report["executive_summary"],
            normal_style
        )
    )

    story.append(Spacer(1, 0.25 * inch))

    # ---------------------------------------------------
    # Traffic Statistics
    # ---------------------------------------------------

    story.append(
        Paragraph(
            "2. Traffic Statistics",
            heading_style
        )
    )

    statistics_table = [

        ["Metric", "Value"],

        ["Total Predictions", statistics["total_predictions"]],

        ["Average Passengers", statistics["average_passengers"]],

        ["High Alerts", statistics["high_alerts"]],

        ["Busiest Route", statistics["busiest_route"]]

    ]

    table = Table(statistics_table)

    table.setStyle(

        TableStyle([

            ("BACKGROUND", (0,0), (-1,0), colors.lightblue),

            ("GRID", (0,0), (-1,-1), 1, colors.grey),

            ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),

            ("BOTTOMPADDING", (0,0), (-1,0), 8),

            ("ALIGN", (0,0), (-1,-1), "CENTER"),
            ("TEXTCOLOR", (0,0), (-1,0), colors.white),

        ])

    )

    story.append(table)

    story.append(Spacer(1, 0.25 * inch))

    # ---------------------------------------------------
    # Current Operational Status
    # ---------------------------------------------------

    story.append(
        Paragraph(
            "3. Current Operational Status",
            heading_style
        )
    )

    story.append(
        Paragraph(
            f"""
            Crowd Level : {statistics["current_crowd_level"]}<br/>
            Platform Status : {statistics["platform_status"]}<br/>
            Train Interval : {statistics["recommended_train_interval"]}<br/>
            Extra Trains : {statistics["extra_trains"]}
            """,
            normal_style
        )
    )

    story.append(Spacer(1, 0.25 * inch))

    # ---------------------------------------------------
    # Key Findings
    # ---------------------------------------------------

    story.append(
        Paragraph(
            "4. Key Findings",
            heading_style
        )
    )

    for finding in ai_report["key_findings"]:

        story.append(
            Paragraph(
                f"• {finding}",
                normal_style
            )
        )

    story.append(Spacer(1, 0.25 * inch))

    # ---------------------------------------------------
    # AI Recommendations
    # ---------------------------------------------------

    story.append(
        Paragraph(
            "5. AI Recommendations",
            heading_style
        )
    )

    for recommendation in ai_report["operational_recommendations"]:

        story.append(
            Paragraph(
                f"• {recommendation}",
                normal_style
            )
        )

    story.append(Spacer(1, 0.25 * inch))

    # ---------------------------------------------------
    # Recent Predictions
    # ---------------------------------------------------

    story.append(
        Paragraph(
            "6. Recent Prediction History",
            heading_style
        )
    )

    prediction_table = [

        ["From", "To", "Passengers", "Crowd"]

    ]

    for prediction in predictions:

        prediction_table.append([

            prediction.from_station,

            prediction.to_station,

            prediction.predicted_passengers,

            prediction.crowd_level

        ])

    history_table = Table(prediction_table)

    history_table.setStyle(

        TableStyle([

            ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),

            ("GRID", (0,0), (-1,-1), 1, colors.grey),

            ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),

            ("ALIGN", (0,0), (-1,-1), "CENTER")

        ])

    )

    story.append(history_table)

    story.append(Spacer(1, 0.3 * inch))

    # ---------------------------------------------------
    # Footer
    # ---------------------------------------------------

    story.append(

        Paragraph(

            "<b>Generated automatically by MetroFlow AI</b>",

            normal_style

        )

    )

    doc.build(story)

    return pdf_path
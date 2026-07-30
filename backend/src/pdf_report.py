from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch
from datetime import datetime
import io


def generate_pdf(report):

    buffer = io.BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    story = []

    title = Paragraph(
        "<b><font size=22 color='darkblue'>MetroFlow AI Traffic Report</font></b>",
        styles["Title"]
    )

    story.append(title)
    story.append(Spacer(1, 0.3 * inch))

    story.append(
        Paragraph(
            f"<b>Generated:</b> {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 0.3 * inch))

    data = [

        ["Metric", "Value"],

        ["Total Passengers", str(report["Total_Passengers"])],

        ["Average Passenger Count", str(report["Average_Passenger_Count"])],

        ["Average Delay (min)", str(report["Average_Delay"])],

        ["Peak Hour", str(report["Peak_Hour"])],

        ["Most Crowded Station", str(report["Most_Crowded_Station"])],

        ["Maximum Occupancy (%)", str(report["Maximum_Occupancy"])]

    ]

    table = Table(data, colWidths=[3 * inch, 3 * inch])

    table.setStyle(TableStyle([

        ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),

        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

        ("GRID", (0, 0), (-1, -1), 1, colors.grey),

        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),

        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),

        ("ALIGN", (0, 0), (-1, -1), "CENTER"),

    ]))

    story.append(table)

    story.append(Spacer(1, 0.4 * inch))

    story.append(
        Paragraph(
            "<b>AI Recommendation</b>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            "Continue monitoring passenger movement. Increase train frequency during peak hours to reduce congestion.",
            styles["BodyText"]
        )
    )

    story.append(Spacer(1, 0.3 * inch))

    story.append(
        Paragraph(
            "<font color='grey'>Generated automatically by MetroFlow AI Platform</font>",
            styles["Italic"]
        )
    )

    doc.build(story)

    pdf = buffer.getvalue()

    buffer.close()

    return pdf
import io
import pandas as pd
from datetime import datetime

def generate_excel_report(crowd_summary: dict, delays: list, line_perf: list) -> io.BytesIO:
    """Generates a multi-sheet Excel report containing system operational insights."""
    output = io.BytesIO()
    
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        # Sheet 1: Key Metrics
        metrics_data = [
            {"Metric": "Total Passenger Entries", "Value": crowd_summary.get("metrics", {}).get("total_entries", 0)},
            {"Metric": "Total Passenger Exits", "Value": crowd_summary.get("metrics", {}).get("total_exits", 0)},
            {"Metric": "Average Hourly Flow", "Value": crowd_summary.get("metrics", {}).get("avg_entries_per_hour", 0.0)},
            {"Metric": "Report Generation Time", "Value": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        ]
        df_metrics = pd.DataFrame(metrics_data)
        df_metrics.to_excel(writer, sheet_name="Executive Summary", index=False)
        
        # Sheet 2: Line Performance
        if line_perf:
            df_lines = pd.DataFrame(line_perf)
            df_lines.to_excel(writer, sheet_name="Line Performance", index=False)
            
        # Sheet 3: Delay Logs
        if delays:
            df_delays = pd.DataFrame(delays)
            df_delays.to_excel(writer, sheet_name="Delay Logs", index=False)
            
        # Sheet 4: Top Busiest Stations
        top_stns = crowd_summary.get("top_busiest_stations", [])
        if top_stns:
            df_stns = pd.DataFrame(top_stns)
            df_stns.to_excel(writer, sheet_name="Top Stations", index=False)

    output.seek(0)
    return output

def generate_pdf_report(traffic_report: dict) -> io.BytesIO:
    """Generates an executive PDF report using ReportLab."""
    output = io.BytesIO()
    
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        doc = SimpleDocTemplate(output, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []
        styles = getSampleStyleSheet()

        # Title
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor('#1e1b4b'),
            spaceAfter=12
        )
        story.append(Paragraph("<b>MetroFlow: AI Traffic & Congestion Report</b>", title_style))
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
        story.append(Spacer(1, 14))

        # System Summary Section
        story.append(Paragraph("<b>1. Operational Performance Overview</b>", styles['Heading2']))
        summary = traffic_report.get("system_summary", {})
        
        summary_data = [
            ["Metric Name", "Value"],
            ["Total Passengers Monitored", str(summary.get("total_passengers_monitored", 0))],
            ["Average Flow per Station", f"{summary.get('average_flow_per_station', 0)} pax/hr"],
            ["Operational Efficiency Score", str(summary.get("operational_efficiency_score", "95%"))],
            ["Severe Bottlenecks Detected", str(summary.get("severe_bottlenecks_detected", 0))]
        ]
        
        t_summary = Table(summary_data, colWidths=[250, 250])
        t_summary.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (1,0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0,0), (1,0), colors.whitesmoke),
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t_summary)
        story.append(Spacer(1, 16))

        # Recommendations Section
        story.append(Paragraph("<b>2. AI Recommendations</b>", styles['Heading2']))
        recs = traffic_report.get("executive_recommendations", [])
        for rec in recs:
            story.append(Paragraph(f"• {rec}", styles['Normal']))
            story.append(Spacer(1, 4))
            
        doc.build(story)
        output.seek(0)
        return output

    except Exception as e:
        # Fallback text PDF generation if reportlab styles fail
        output.write(f"MetroFlow Traffic Report - Generated at {datetime.now()}\n\n{traffic_report}".encode('utf-8'))
        output.seek(0)
        return output

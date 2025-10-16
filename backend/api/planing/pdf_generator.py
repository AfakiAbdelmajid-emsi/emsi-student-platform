import os
from tempfile import NamedTemporaryFile
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime
import math

def generate_study_plan_pdf(exams):
    # Sort exams by exam date ascending
    exams = sorted(exams, key=lambda x: (x["priority"], x["exam_date"]))


    # Extract subjects ordered by urgency
    subjects = [e["title"] for e in exams]

    # Weekly study slots: 4 sessions per day × 6 days
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday (Review)"]
    time_slots = ["08:00–10:00", "10:30–12:30", "14:00–16:00", "18:00–20:00"]
    total_slots = len(days) * len(time_slots)

    # Repeat subjects to fill schedule evenly
    repetitions = math.ceil(total_slots / len(subjects))
    study_plan_flat = (subjects * repetitions)[:total_slots]

    # Format into 2D array: time slot rows × day columns
    schedule = []
    for i in range(len(time_slots)):
        row = [time_slots[i]] + [study_plan_flat[i + j * len(time_slots)] for j in range(len(days))]
        schedule.append(row)

    # Create PDF
    try:
        with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            buffer_path = tmp_file.name
            
            # Reduce margins to give more space to the table
            doc = SimpleDocTemplate(buffer_path, pagesize=A4, 
                                  rightMargin=20, leftMargin=20, 
                                  topMargin=30, bottomMargin=30)
            elements = []

            styles = getSampleStyleSheet()
            title = Paragraph("📋 Weekly Study Plan", styles['Title'])
            elements.append(title)
            elements.append(Spacer(1, 12))

            # Calculate column widths - fixed width for time slot, distribute remaining space for days
            time_slot_width = 60  # Fixed width for time slot column
            remaining_width = A4[0] - 40 - time_slot_width  # Subtract margins and time slot width
            day_width = remaining_width / len(days)
            
            col_widths = [time_slot_width] + [day_width] * len(days)

            # Define styles for better text wrapping
            cell_style = ParagraphStyle(
                name='CellStyle', 
                fontSize=8, 
                alignment=1,  # Center alignment
                wordWrap='CJK',
                leading=10  # Line spacing
            )
            
            header_style = ParagraphStyle(
                name='HeaderStyle',
                fontSize=8,
                alignment=1,
                textColor=colors.whitesmoke,
                fontName='Helvetica-Bold',
                leading=10
            )

            # Create the header row with normal (not rotated) text
            header = ["Time Slot"] + days
            data = [header] + schedule

            # Wrap all text in Paragraphs for proper text wrapping
            for row_idx in range(len(data)):
                for col_idx in range(len(data[row_idx])):
                    if row_idx == 0:  # Header row
                        data[row_idx][col_idx] = Paragraph(str(data[row_idx][col_idx]), header_style)
                    elif col_idx == 0:  # Time slot cells
                        data[row_idx][col_idx] = Paragraph(str(data[row_idx][col_idx]), cell_style)
                    else:  # Subject cells
                        data[row_idx][col_idx] = Paragraph(str(data[row_idx][col_idx]), cell_style)

            # Create the table with adjusted row heights
            table = Table(data, repeatRows=1, colWidths=col_widths, rowHeights=30)

            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),  # Thinner grid lines
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('WORDWRAP', (0, 0), (-1, -1), 'CJK'),
                ('LEADING', (0, 0), (-1, -1), 10),  # Consistent line spacing
            ]))

            elements.append(table)
            doc.build(elements)

            return open(buffer_path, "rb").read()

    except Exception as e:
        raise Exception(f"Error generating plan: {str(e)}")
import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

FRONTEND_URL = os.getenv("FRONTEND_URL")


def send_reset_email(email: str, token: str):

    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    subject = "MetroFlow Password Reset"

    body = f"""
Hello,

We received a request to reset your MetroFlow password.

Click the link below to reset your password:

{reset_link}

This link expires in 15 minutes.

If you didn't request this, simply ignore this email.

Regards,
MetroFlow Team
"""

    message = MIMEMultipart()

    message["From"] = SMTP_EMAIL
    message["To"] = email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(message)
import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.auth.users import fake_users_db
from app.auth.jwt_handler import create_access_token

import random
load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_APP_PASSWORD = os.getenv("EMAIL_APP_PASSWORD")

router = APIRouter()


# =========================================================
# LOGIN MODEL
# =========================================================

class LoginRequest(BaseModel):
    username: str
    password: str


# =========================================================
# REGISTER MODEL
# =========================================================

class RegisterRequest(BaseModel):
    username: str
    name: str
    email: EmailStr
    mobile: str
    password: str


# =========================================================
# FORGOT PASSWORD MODEL
# =========================================================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    password: str


# Temporary OTP storage
reset_otps = {}


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(user: LoginRequest):

    login_value = user.username.strip().lower()

    db_user = None

    # -----------------------------------------
    # Check username
    # -----------------------------------------
    if login_value in fake_users_db:
        db_user = fake_users_db[login_value]

    # -----------------------------------------
    # If username not found, check email
    # -----------------------------------------
    if not db_user:
        for existing_user in fake_users_db.values():

            if existing_user["email"].lower() == login_value:
                db_user = existing_user
                break

    # -----------------------------------------
    # User not found
    # -----------------------------------------
    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Username or Email"
        )

    # -----------------------------------------
    # Check password
    # -----------------------------------------
    if user.password != db_user["password"]:
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    # -----------------------------------------
    # Create JWT token
    # -----------------------------------------
    token = create_access_token(
        {
            "sub": db_user["username"],
            "role": db_user["role"],
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user["role"],
        "username": db_user["username"],
        "name": db_user["name"],
        "email": db_user["email"],
    }


# =========================================================
# REGISTER
# =========================================================

@router.post("/register")
def register(user: RegisterRequest):

    # Check whether username already exists
    if user.username in fake_users_db:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    # Check whether email already exists
    for existing_user in fake_users_db.values():
        if existing_user["email"].lower() == user.email.lower():
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

    # Create user
    fake_users_db[user.username] = {
        "username": user.username,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile,
        "password": user.password,
        "role": "user",
    }

    return {
        "message": "Registration successful"
    }

def send_otp_email(receiver_email, otp):

    if not EMAIL_ADDRESS or not EMAIL_APP_PASSWORD:
        raise Exception("Email configuration is missing in .env")

    message = MIMEMultipart()

    message["From"] = EMAIL_ADDRESS
    message["To"] = receiver_email
    message["Subject"] = "Metro AI - Password Reset OTP"

    body = f"""
Hello,

We received a request to reset your Metro AI Crowd Management account password.

Your OTP is:

{otp}

This OTP is required to verify your identity and reset your password.

If you did not request a password reset, please ignore this email.

Regards,
Metro AI Crowd Management System
"""

    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:

        server.starttls()

        server.login(
            EMAIL_ADDRESS,
            EMAIL_APP_PASSWORD
        )

        server.sendmail(
            EMAIL_ADDRESS,
            receiver_email,
            message.as_string()
        )
# =========================================================
# FORGOT PASSWORD - SEND OTP
# =========================================================

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest):

    user = None

    for db_user in fake_users_db.values():

        if db_user["email"].lower() == request.email.lower():
            user = db_user
            break

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not registered"
        )

    # Generate 6 digit OTP
    otp = str(random.randint(100000, 999999))

    # Store OTP
    reset_otps[request.email.lower()] = otp

    # Send OTP to user's email
    try:

        send_otp_email(
            request.email,
            otp
        )

    except Exception as e:

        print("Email sending error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to send OTP email"
        )

    return {
        "message": "OTP sent successfully to your email"
    }


# =========================================================
# VERIFY OTP
# =========================================================

@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest):

    email = request.email.lower()

    saved_otp = reset_otps.get(email)

    if not saved_otp:
        raise HTTPException(
            status_code=400,
            detail="OTP not found or expired"
        )

    if request.otp != saved_otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    return {
        "message": "OTP verified successfully"
    }


# =========================================================
# RESET PASSWORD
# =========================================================

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest):

    email = request.email.lower()

    # Find user
    username = None

    for key, db_user in fake_users_db.items():

        if db_user["email"].lower() == email:
            username = key
            break

    if not username:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Make sure OTP was generated
    if email not in reset_otps:
        raise HTTPException(
            status_code=400,
            detail="Password reset request not found"
        )

    # Change password
    fake_users_db[username]["password"] = request.password

    # Remove OTP after password reset
    del reset_otps[email]

    return {
        "message": "Password reset successful"
    }
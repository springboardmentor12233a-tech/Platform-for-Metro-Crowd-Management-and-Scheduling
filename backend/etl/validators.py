import pandas as pd
from datetime import datetime
from typing import Any

def clean_float(value: Any):
    if pd.isna(value) or value is None:
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

def clean_int(value: Any):
    if pd.isna(value) or value is None:
        return None
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return None

def clean_string(value: Any):
    if pd.isna(value) or value is None:
        return None
    s = str(value).strip()
    return s if s else None

def clean_bool(value: Any):
    if pd.isna(value) or value is None:
        return False
    if isinstance(value, bool):
        return value
    s = str(value).strip().lower()
    return s in ('true', '1', 'yes', 'y')

def parse_date(value: Any):
    if pd.isna(value) or not value:
        return None
    try:
        return pd.to_datetime(value).date()
    except Exception:
        return None

def parse_time(value: Any):
    if pd.isna(value) or not value:
        return None
    try:
        return pd.to_datetime(value).time()
    except Exception:
        return None

def parse_datetime(value: Any):
    if pd.isna(value) or not value:
        return None
    try:
        return pd.to_datetime(value).to_pydatetime()
    except Exception:
        return None

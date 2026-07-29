import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent / "app" / "models"
BASE_DIR.mkdir(parents=True, exist_ok=True)

files = {}

files["base.py"] = """
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime, func
from datetime import datetime

class Base(DeclarativeBase):
    pass

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
"""

files["enums.py"] = """
# Any required enums
"""

files["station.py"] = """
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Station(Base, TimestampMixin):
    __tablename__ = "stations"
    station_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    station_name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
"""

files["train.py"] = """
from typing import Optional
from sqlalchemy import String, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Train(Base, TimestampMixin):
    __tablename__ = "trains"
    train_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    train_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    train_name: Mapped[Optional[str]] = mapped_column(String(100))
    line: Mapped[Optional[str]] = mapped_column(String(50))
    capacity: Mapped[Optional[int]] = mapped_column(Integer)
    current_station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"))
    status: Mapped[Optional[str]] = mapped_column(String(50))
    speed_limit_kmh: Mapped[Optional[float]] = mapped_column(Float)
    manufacturer: Mapped[Optional[str]] = mapped_column(String(100))
    model: Mapped[Optional[str]] = mapped_column(String(100))
    year_of_manufacture: Mapped[Optional[int]] = mapped_column(Integer)
"""

files["schedules.py"] = """
from typing import Optional
from datetime import time
from sqlalchemy import String, Integer, ForeignKey, Time
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Schedule(Base, TimestampMixin):
    __tablename__ = "schedules"
    schedule_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    train_id: Mapped[str] = mapped_column(ForeignKey("trains.train_id"), index=True)
    station_id: Mapped[int] = mapped_column(ForeignKey("stations.station_id"), index=True)
    arrival_time: Mapped[Optional[time]] = mapped_column(Time)
    departure_time: Mapped[Optional[time]] = mapped_column(Time)
    stop_sequence: Mapped[Optional[int]] = mapped_column(Integer)
    day_type: Mapped[Optional[str]] = mapped_column(String(50))
    platform: Mapped[Optional[str]] = mapped_column(String(50))
"""

files["delay.py"] = """
from typing import Optional
from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Delay(Base, TimestampMixin):
    __tablename__ = "delays"
    incident_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    train_id: Mapped[Optional[str]] = mapped_column(ForeignKey("trains.train_id"), index=True)
    station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"), index=True)
    incident_time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    delay_minutes: Mapped[Optional[int]] = mapped_column(Integer)
    incident_type: Mapped[Optional[str]] = mapped_column(String(100))
    severity: Mapped[Optional[str]] = mapped_column(String(50))
    resolved: Mapped[Optional[bool]] = mapped_column(Boolean)
"""

files["trip.py"] = """
from typing import Optional
from datetime import datetime, date
from sqlalchemy import String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Trip(Base, TimestampMixin):
    __tablename__ = "trips"
    trip_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    train_id: Mapped[Optional[str]] = mapped_column(ForeignKey("trains.train_id"), index=True)
    origin_station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"))
    destination_station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"))
    departure_time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    arrival_time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    trip_date: Mapped[Optional[date]] = mapped_column(Date)
    trip_duration_min: Mapped[Optional[float]] = mapped_column(Float)
    distance_km: Mapped[Optional[float]] = mapped_column(Float)
    average_speed_kmh: Mapped[Optional[float]] = mapped_column(Float)
"""

files["occupancy.py"] = """
from typing import Optional
from datetime import datetime
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Occupancy(Base, TimestampMixin):
    __tablename__ = "occupancy"
    record_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    train_id: Mapped[Optional[str]] = mapped_column(ForeignKey("trains.train_id"), index=True)
    station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"), index=True)
    timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime)
    occupancy: Mapped[Optional[int]] = mapped_column(Integer)
    capacity: Mapped[Optional[int]] = mapped_column(Integer)
    occupancy_percentage: Mapped[Optional[float]] = mapped_column(Float)
    crowd_level: Mapped[Optional[str]] = mapped_column(String(50))
"""

files["sensor_telemetry.py"] = """
from typing import Optional
from datetime import datetime
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class SensorTelemetry(Base, TimestampMixin):
    __tablename__ = "sensor_telemetry"
    sensor_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"), index=True)
    timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime)
    temperature: Mapped[Optional[float]] = mapped_column(Float)
    humidity: Mapped[Optional[float]] = mapped_column(Float)
    co2_ppm: Mapped[Optional[float]] = mapped_column(Float)
    pm25: Mapped[Optional[float]] = mapped_column(Float)
    platform_crowd: Mapped[Optional[int]] = mapped_column(Integer)
    escalator_status: Mapped[Optional[str]] = mapped_column(String(50))
    lift_status: Mapped[Optional[str]] = mapped_column(String(50))
    camera_status: Mapped[Optional[str]] = mapped_column(String(50))
"""

files["ticket.py"] = """
from typing import Optional
from datetime import datetime, date
from sqlalchemy import String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Ticket(Base, TimestampMixin):
    __tablename__ = "tickets"
    ticket_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    origin_station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"))
    destination_station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"))
    fare: Mapped[Optional[float]] = mapped_column(Float)
    ticket_type: Mapped[Optional[str]] = mapped_column(String(50))
    payment_method: Mapped[Optional[str]] = mapped_column(String(50))
    purchase_time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    travel_date: Mapped[Optional[date]] = mapped_column(Date)
    passenger_category: Mapped[Optional[str]] = mapped_column(String(50))
"""

files["crowd_history.py"] = """
from typing import Optional
from datetime import datetime
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class CrowdHistory(Base, TimestampMixin):
    __tablename__ = "crowd_history"
    record_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"), index=True)
    timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime)
    entry_count: Mapped[Optional[int]] = mapped_column(Integer)
    exit_count: Mapped[Optional[int]] = mapped_column(Integer)
    platform_count: Mapped[Optional[int]] = mapped_column(Integer)
    concourse_count: Mapped[Optional[int]] = mapped_column(Integer)
    crowd_density: Mapped[Optional[float]] = mapped_column(Float)
"""

files["crowd_prediction.py"] = """
from typing import Optional
from datetime import datetime
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class CrowdPrediction(Base, TimestampMixin):
    __tablename__ = "crowd_prediction"
    prediction_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"), index=True)
    prediction_time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    predicted_entries: Mapped[Optional[int]] = mapped_column(Integer)
    predicted_exits: Mapped[Optional[int]] = mapped_column(Integer)
    predicted_platform_crowd: Mapped[Optional[int]] = mapped_column(Integer)
    predicted_crowd_level: Mapped[Optional[str]] = mapped_column(String(50))
    confidence_score: Mapped[Optional[float]] = mapped_column(Float)
"""

files["passenger_journey.py"] = """
from typing import Optional
from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class PassengerJourney(Base, TimestampMixin):
    __tablename__ = "passenger_journeys"
    passenger_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    entry_station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"))
    entry_time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    entry_gate: Mapped[Optional[str]] = mapped_column(String(50))
    exit_station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stations.station_id"))
    exit_time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    exit_gate: Mapped[Optional[str]] = mapped_column(String(50))
    travel_duration_mins: Mapped[Optional[int]] = mapped_column(Integer)
"""

files["__init__.py"] = """
from .base import Base, TimestampMixin
from .station import Station
from .train import Train
from .schedules import Schedule
from .delay import Delay
from .trip import Trip
from .occupancy import Occupancy
from .sensor_telemetry import SensorTelemetry
from .ticket import Ticket
from .crowd_history import CrowdHistory
from .crowd_prediction import CrowdPrediction
from .passenger_journey import PassengerJourney
from .enums import *
"""

for fname, content in files.items():
    with open(BASE_DIR / fname, 'w', encoding='utf-8') as f:
        f.write(content.strip() + "\n")

print("Generated models successfully.")

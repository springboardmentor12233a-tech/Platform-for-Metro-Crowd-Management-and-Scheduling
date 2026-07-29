"""
AI MetroFlow - Metro Crowd Management and Scheduling Platform
Single-file Flask backend: configuration, models, auth, and all REST APIs.
Serves the single-page frontend (index.html) and talks to PostgreSQL.
"""
import os
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, get_jwt, jwt_required
)
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func
from dotenv import load_dotenv

load_dotenv()

# =======================================================================
# CONFIG (inline — single backend file)
# =======================================================================
USE_SQLITE = os.getenv("USE_SQLITE", "true").lower() == "true"

app = Flask(__name__, template_folder=".")

if USE_SQLITE:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///metroflow.db"
else:
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "metroflow")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
    )
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True}
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-this-secret-key")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-this-jwt-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]

# Congestion / frequency thresholds (entry_count + exit_count of latest reading)
CROWD_THRESHOLD_ORANGE = 500
CROWD_THRESHOLD_RED = 900
FREQUENCY_RECOMMENDATION_THRESHOLD = 900

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})

# In-memory blocklist for logged-out JWTs (fine for single-process demo)
BLOCKLIST = set()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLOCKLIST


# =======================================================================
# MODELS
# =======================================================================
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="operator")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, raw_password):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password, raw_password)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email, "role": self.role}


class Station(db.Model):
    __tablename__ = "stations"
    id = db.Column(db.Integer, primary_key=True)
    station_name = db.Column(db.String(150), unique=True, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"id": self.id, "station_name": self.station_name, "location": self.location}


class PassengerData(db.Model):
    __tablename__ = "passenger_data"
    id = db.Column(db.Integer, primary_key=True)
    station_id = db.Column(db.Integer, db.ForeignKey("stations.id", ondelete="CASCADE"), nullable=False)
    entry_count = db.Column(db.Integer, default=0)
    exit_count = db.Column(db.Integer, default=0)
    recorded_time = db.Column(db.DateTime, default=datetime.utcnow)

    station = db.relationship("Station", backref="passenger_readings")

    def to_dict(self):
        return {
            "id": self.id, "station_id": self.station_id,
            "entry_count": self.entry_count, "exit_count": self.exit_count,
            "recorded_time": self.recorded_time.isoformat(),
        }


class TrainSchedule(db.Model):
    __tablename__ = "train_schedule"
    id = db.Column(db.Integer, primary_key=True)
    train_name = db.Column(db.String(100), nullable=False)
    station_id = db.Column(db.Integer, db.ForeignKey("stations.id", ondelete="CASCADE"), nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default="Running")

    station = db.relationship("Station", backref="schedules")

    def to_dict(self):
        return {
            "id": self.id, "train_name": self.train_name, "station_id": self.station_id,
            "station_name": self.station.station_name if self.station else None,
            "arrival_time": self.arrival_time.isoformat(),
            "departure_time": self.departure_time.isoformat(),
            "status": self.status,
        }


class Alert(db.Model):
    __tablename__ = "alerts"
    id = db.Column(db.Integer, primary_key=True)
    station_id = db.Column(db.Integer, db.ForeignKey("stations.id", ondelete="CASCADE"), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    severity = db.Column(db.String(20), default="Info")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    station = db.relationship("Station", backref="alerts")

    def to_dict(self):
        return {
            "id": self.id, "station_id": self.station_id,
            "station_name": self.station.station_name if self.station else None,
            "message": self.message, "severity": self.severity,
            "created_at": self.created_at.isoformat(),
        }


# =======================================================================
# HELPERS
# =======================================================================
def role_required(*roles):
    """Decorator restricting a route to specific user roles (RBAC)."""
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") not in roles:
                return jsonify({"error": "Insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def heat_level(total):
    if total >= CROWD_THRESHOLD_RED:
        return "Red"
    if total >= CROWD_THRESHOLD_ORANGE:
        return "Orange"
    return "Green"


def latest_reading_per_station():
    subq = (
        db.session.query(
            PassengerData.station_id,
            func.max(PassengerData.recorded_time).label("max_time"),
        )
        .group_by(PassengerData.station_id)
        .subquery()
    )
    return (
        db.session.query(PassengerData)
        .join(
            subq,
            (PassengerData.station_id == subq.c.station_id)
            & (PassengerData.recorded_time == subq.c.max_time),
        )
        .all()
    )


# =======================================================================
# FRONTEND (single page — everything else is client-side routed)
# =======================================================================
@app.route("/")
def index():
    return render_template("index.html")


@app.errorhandler(404)
def not_found(e):
    # SPA handles its own "not found" view; just point back to the app.
    return render_template("index.html"), 200


# =======================================================================
# AUTH APIs
# =======================================================================
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter(func.lower(User.email) == email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "name": user.name, "email": user.email},
    )
    return jsonify({"access_token": access_token, "user": user.to_dict()}), 200


@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    BLOCKLIST.add(get_jwt()["jti"])
    return jsonify({"message": "Logged out successfully"}), 200


# =======================================================================
# DASHBOARD API
# =======================================================================
@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    todays_passengers = (
        db.session.query(func.coalesce(func.sum(PassengerData.entry_count), 0))
        .filter(PassengerData.recorded_time >= today_start)
        .scalar()
    )

    readings = latest_reading_per_station()
    busiest, busiest_total = None, -1
    for r in readings:
        total = r.entry_count + r.exit_count
        if total > busiest_total:
            busiest_total = total
            busiest = r.station.station_name if r.station else None

    running_trains = TrainSchedule.query.filter_by(status="Running").count()
    delayed_trains = TrainSchedule.query.filter_by(status="Delayed").count()

    peak_row = (
        db.session.query(
            func.extract("hour", PassengerData.recorded_time).label("hr"),
            func.sum(PassengerData.entry_count).label("total"),
        )
        .group_by("hr")
        .order_by(func.sum(PassengerData.entry_count).desc())
        .first()
    )
    peak_hour = f"{int(peak_row.hr):02d}:00" if peak_row else "N/A"

    return jsonify({
        "todays_passengers": int(todays_passengers or 0),
        "busy_station": busiest or "N/A",
        "running_trains": running_trains,
        "delayed_trains": delayed_trains,
        "peak_hour": peak_hour,
    }), 200


# =======================================================================
# CROWD MONITORING API
# =======================================================================
@app.route("/crowd", methods=["GET"])
@jwt_required()
def crowd_monitoring():
    readings = latest_reading_per_station()
    result = []
    for r in readings:
        total = r.entry_count + r.exit_count
        result.append({
            "station_id": r.station_id,
            "station_name": r.station.station_name if r.station else None,
            "entry_count": r.entry_count,
            "exit_count": r.exit_count,
            "total": total,
            "heat_level": heat_level(total),
            "recorded_time": r.recorded_time.isoformat(),
        })
    result.sort(key=lambda x: x["total"], reverse=True)
    return jsonify(result), 200


# =======================================================================
# STATIONS CRUD API
# =======================================================================
@app.route("/stations", methods=["GET"])
@jwt_required()
def get_stations():
    search = request.args.get("search", "").strip()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    query = Station.query
    if search:
        like = f"%{search}%"
        query = query.filter((Station.station_name.ilike(like)) | (Station.location.ilike(like)))

    pagination = query.order_by(Station.id).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "stations": [s.to_dict() for s in pagination.items],
        "total": pagination.total, "page": page, "pages": pagination.pages,
    }), 200


@app.route("/stations", methods=["POST"])
@role_required("admin")
def create_station():
    data = request.get_json(silent=True) or {}
    station_name = data.get("station_name", "").strip()
    location = data.get("location", "").strip()

    if not station_name or not location:
        return jsonify({"error": "station_name and location are required"}), 400
    if Station.query.filter_by(station_name=station_name).first():
        return jsonify({"error": "A station with this name already exists"}), 409

    station = Station(station_name=station_name, location=location)
    db.session.add(station)
    db.session.commit()
    return jsonify(station.to_dict()), 201


@app.route("/stations/<int:station_id>", methods=["PUT"])
@role_required("admin")
def update_station(station_id):
    station = Station.query.get_or_404(station_id)
    data = request.get_json(silent=True) or {}
    station_name = data.get("station_name", station.station_name).strip()
    location = data.get("location", station.location).strip()

    duplicate = Station.query.filter(Station.station_name == station_name, Station.id != station_id).first()
    if duplicate:
        return jsonify({"error": "A station with this name already exists"}), 409

    station.station_name = station_name
    station.location = location
    db.session.commit()
    return jsonify(station.to_dict()), 200


@app.route("/stations/<int:station_id>", methods=["DELETE"])
@role_required("admin")
def delete_station(station_id):
    station = Station.query.get_or_404(station_id)
    db.session.delete(station)
    db.session.commit()
    return jsonify({"message": "Station deleted"}), 200


# =======================================================================
# TRAIN SCHEDULE CRUD API
# =======================================================================
@app.route("/schedule", methods=["GET"])
@jwt_required()
def get_schedule():
    search = request.args.get("search", "").strip()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    query = TrainSchedule.query.join(Station)
    if search:
        like = f"%{search}%"
        query = query.filter((TrainSchedule.train_name.ilike(like)) | (Station.station_name.ilike(like)))

    pagination = query.order_by(TrainSchedule.arrival_time).paginate(page=page, per_page=per_page, error_out=False)

    items = []
    for sched in pagination.items:
        d = sched.to_dict()
        latest = (
            PassengerData.query.filter_by(station_id=sched.station_id)
            .order_by(PassengerData.recorded_time.desc())
            .first()
        )
        total = (latest.entry_count + latest.exit_count) if latest else 0
        d["recommend_increase_frequency"] = total >= FREQUENCY_RECOMMENDATION_THRESHOLD
        items.append(d)

    return jsonify({
        "schedule": items, "total": pagination.total, "page": page, "pages": pagination.pages,
    }), 200


@app.route("/schedule", methods=["POST"])
@role_required("admin", "operator")
def create_schedule():
    data = request.get_json(silent=True) or {}
    required = ["train_name", "station_id", "arrival_time", "departure_time"]
    if not all(data.get(f) for f in required):
        return jsonify({"error": "train_name, station_id, arrival_time, departure_time are required"}), 400
    if not Station.query.get(data["station_id"]):
        return jsonify({"error": "Invalid station_id"}), 400

    try:
        arrival = datetime.fromisoformat(data["arrival_time"])
        departure = datetime.fromisoformat(data["departure_time"])
    except ValueError:
        return jsonify({"error": "Invalid datetime format, use ISO 8601"}), 400

    sched = TrainSchedule(
        train_name=data["train_name"].strip(), station_id=data["station_id"],
        arrival_time=arrival, departure_time=departure, status=data.get("status", "Running"),
    )
    db.session.add(sched)
    db.session.commit()
    return jsonify(sched.to_dict()), 201


@app.route("/schedule/<int:schedule_id>", methods=["PUT"])
@role_required("admin", "operator")
def update_schedule(schedule_id):
    sched = TrainSchedule.query.get_or_404(schedule_id)
    data = request.get_json(silent=True) or {}

    if "train_name" in data:
        sched.train_name = data["train_name"].strip()
    if "station_id" in data:
        if not Station.query.get(data["station_id"]):
            return jsonify({"error": "Invalid station_id"}), 400
        sched.station_id = data["station_id"]
    if "arrival_time" in data:
        sched.arrival_time = datetime.fromisoformat(data["arrival_time"])
    if "departure_time" in data:
        sched.departure_time = datetime.fromisoformat(data["departure_time"])
    if "status" in data and data["status"] in ("Running", "Delayed", "Cancelled"):
        sched.status = data["status"]

    db.session.commit()
    return jsonify(sched.to_dict()), 200


@app.route("/schedule/<int:schedule_id>", methods=["DELETE"])
@role_required("admin")
def delete_schedule(schedule_id):
    sched = TrainSchedule.query.get_or_404(schedule_id)
    db.session.delete(sched)
    db.session.commit()
    return jsonify({"message": "Schedule entry deleted"}), 200


# =======================================================================
# ANALYTICS API
# =======================================================================
@app.route("/analytics", methods=["GET"])
@jwt_required()
def analytics():
    since = datetime.utcnow() - timedelta(days=7)
    trend_rows = (
        db.session.query(
            func.date(PassengerData.recorded_time).label("day"),
            func.sum(PassengerData.entry_count).label("entries"),
            func.sum(PassengerData.exit_count).label("exits"),
        )
        .filter(PassengerData.recorded_time >= since)
        .group_by("day").order_by("day").all()
    )
    passenger_trend = [
        {"date": str(r.day), "entries": int(r.entries or 0), "exits": int(r.exits or 0)}
        for r in trend_rows
    ]

    readings = latest_reading_per_station()
    station_ranking = sorted(
        [{"station_name": r.station.station_name if r.station else None,
          "total": r.entry_count + r.exit_count} for r in readings],
        key=lambda x: x["total"], reverse=True,
    )

    hour_rows = (
        db.session.query(
            func.extract("hour", PassengerData.recorded_time).label("hr"),
            func.sum(PassengerData.entry_count).label("entries"),
        )
        .group_by("hr").order_by("hr").all()
    )
    peak_hour_analysis = [{"hour": int(r.hr), "entries": int(r.entries or 0)} for r in hour_rows]

    avg_crowd = db.session.query(
        func.avg(PassengerData.entry_count + PassengerData.exit_count)
    ).scalar()

    delay_stats = {
        "running": TrainSchedule.query.filter_by(status="Running").count(),
        "delayed": TrainSchedule.query.filter_by(status="Delayed").count(),
        "cancelled": TrainSchedule.query.filter_by(status="Cancelled").count(),
    }

    return jsonify({
        "passenger_trend": passenger_trend,
        "station_ranking": station_ranking,
        "peak_hour_analysis": peak_hour_analysis,
        "average_crowd": round(float(avg_crowd or 0), 1),
        "delay_statistics": delay_stats,
    }), 200


# =======================================================================
# ALERTS API
# =======================================================================
@app.route("/alerts", methods=["GET"])
@jwt_required()
def get_alerts():
    alerts = Alert.query.order_by(Alert.created_at.desc()).limit(20).all()
    return jsonify([a.to_dict() for a in alerts]), 200


# =======================================================================
# AUTO-INIT DB (SQLite friendly)
# =======================================================================
from werkzeug.security import generate_password_hash as _gen_hash
from datetime import datetime as _dt

def _init_db():
    with app.app_context():
        db.create_all()
        if User.query.first() is None:
            admin = User(name="System Admin", email="admin@metroflow.com", role="admin")
            admin.password = _gen_hash("admin123")
            operator = User(name="Line Operator", email="operator@metroflow.com", role="operator")
            operator.password = _gen_hash("operator123")
            db.session.add_all([admin, operator])
            db.session.flush()

            s1 = Station(station_name="MG Road", location="Bengaluru Central")
            s2 = Station(station_name="Indiranagar", location="Bengaluru East")
            s3 = Station(station_name="Whitefield", location="Bengaluru East")
            s4 = Station(station_name="Yeshwanthpur", location="Bengaluru North")
            s5 = Station(station_name="Majestic", location="Bengaluru Central")
            s6 = Station(station_name="Electronic City", location="Bengaluru South")
            db.session.add_all([s1, s2, s3, s4, s5, s6])
            db.session.flush()

            now = _dt.utcnow
            pd = [
                PassengerData(station_id=s1.id, entry_count=420, exit_count=380, recorded_time=now() - timedelta(hours=1)),
                PassengerData(station_id=s1.id, entry_count=610, exit_count=540, recorded_time=now() - timedelta(minutes=10)),
                PassengerData(station_id=s2.id, entry_count=260, exit_count=240, recorded_time=now() - timedelta(hours=1)),
                PassengerData(station_id=s2.id, entry_count=310, exit_count=290, recorded_time=now() - timedelta(minutes=10)),
                PassengerData(station_id=s3.id, entry_count=520, exit_count=470, recorded_time=now() - timedelta(hours=1)),
                PassengerData(station_id=s3.id, entry_count=700, exit_count=640, recorded_time=now() - timedelta(minutes=10)),
                PassengerData(station_id=s4.id, entry_count=180, exit_count=150, recorded_time=now() - timedelta(hours=1)),
                PassengerData(station_id=s4.id, entry_count=210, exit_count=190, recorded_time=now() - timedelta(minutes=10)),
                PassengerData(station_id=s5.id, entry_count=800, exit_count=760, recorded_time=now() - timedelta(hours=1)),
                PassengerData(station_id=s5.id, entry_count=980, exit_count=910, recorded_time=now() - timedelta(minutes=10)),
                PassengerData(station_id=s6.id, entry_count=300, exit_count=260, recorded_time=now() - timedelta(hours=1)),
                PassengerData(station_id=s6.id, entry_count=340, exit_count=300, recorded_time=now() - timedelta(minutes=10)),
            ]
            db.session.add_all(pd)

            ts = [
                TrainSchedule(train_name="Purple Line Express", station_id=s1.id, arrival_time=now() + timedelta(minutes=10), departure_time=now() + timedelta(minutes=12), status="Running"),
                TrainSchedule(train_name="Green Line Local", station_id=s2.id, arrival_time=now() + timedelta(minutes=5), departure_time=now() + timedelta(minutes=7), status="Running"),
                TrainSchedule(train_name="Purple Line Express", station_id=s3.id, arrival_time=now() + timedelta(minutes=20), departure_time=now() + timedelta(minutes=22), status="Delayed"),
                TrainSchedule(train_name="Green Line Local", station_id=s4.id, arrival_time=now() + timedelta(minutes=15), departure_time=now() + timedelta(minutes=17), status="Running"),
                TrainSchedule(train_name="Yellow Line Shuttle", station_id=s5.id, arrival_time=now() + timedelta(minutes=3), departure_time=now() + timedelta(minutes=5), status="Delayed"),
                TrainSchedule(train_name="Yellow Line Shuttle", station_id=s6.id, arrival_time=now() + timedelta(minutes=25), departure_time=now() + timedelta(minutes=27), status="Cancelled"),
            ]
            db.session.add_all(ts)

            alerts = [
                Alert(station_id=s5.id, message="Majestic reporting severe congestion – deploy additional staff", severity="Critical", created_at=now() - timedelta(minutes=5)),
                Alert(station_id=s3.id, message="Whitefield approaching high crowd density", severity="Warning", created_at=now() - timedelta(minutes=20)),
                Alert(station_id=s1.id, message="MG Road crowd levels rising steadily", severity="Warning", created_at=now() - timedelta(minutes=30)),
            ]
            db.session.add_all(alerts)

            db.session.commit()
            print("Initialized SQLite database with seed data.")
        else:
            print("Database already initialized.")

# =======================================================================
# ENTRYPOINT
# =======================================================================
if __name__ == "__main__":
    _init_db()
    app.run(debug=True, host="0.0.0.0", port=5000)

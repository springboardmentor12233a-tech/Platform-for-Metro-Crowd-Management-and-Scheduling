-- ============================================================
-- MetroFlow Database Schema
-- PostgreSQL 15+
-- Version: 1.0
-- Last Updated: July 7, 2026
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";     -- Password hashing
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- Fuzzy text search

-- ============================================================
-- CUSTOM TYPES (ENUMS)
-- ============================================================
CREATE TYPE user_role AS ENUM ('admin', 'operator', 'viewer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE station_layout AS ENUM ('elevated', 'underground', 'at_grade');
CREATE TYPE line_status AS ENUM ('operational', 'partial', 'suspended', 'maintenance');
CREATE TYPE train_status AS ENUM ('in_service', 'out_of_service', 'maintenance', 'reserved');
CREATE TYPE density_level AS ENUM ('low', 'moderate', 'high', 'critical');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved', 'expired');
CREATE TYPE alert_type AS ENUM ('overcrowding', 'delay', 'maintenance', 'emergency', 'weather', 'system');
CREATE TYPE ticket_type AS ENUM ('single', 'return', 'smart_card', 'tourist_card', 'pass');
CREATE TYPE day_type AS ENUM ('weekday', 'saturday', 'sunday', 'holiday');
CREATE TYPE adjustment_status AS ENUM ('proposed', 'approved', 'applied', 'rejected', 'expired');
CREATE TYPE weather_condition AS ENUM ('clear', 'rain', 'storm', 'fog', 'snow', 'heatwave');


-- ============================================================
-- 1. USER MANAGEMENT
-- ============================================================

-- Roles and permissions lookup
CREATE TABLE permissions (
    id              SERIAL PRIMARY KEY,
    resource        VARCHAR(50) NOT NULL,       -- e.g., 'schedules', 'alerts', 'users'
    action          VARCHAR(20) NOT NULL,       -- e.g., 'read', 'write', 'delete', 'approve'
    description     TEXT,
    UNIQUE (resource, action)
);

CREATE TABLE role_permissions (
    id              SERIAL PRIMARY KEY,
    role            user_role NOT NULL,
    permission_id   INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE (role, permission_id)
);

-- Users
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    role            user_role NOT NULL DEFAULT 'viewer',
    status          user_status NOT NULL DEFAULT 'active',
    phone           VARCHAR(20),
    avatar_url      VARCHAR(500),
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Refresh tokens for JWT auth
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at      TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Audit log for user actions
CREATE TABLE audit_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(50) NOT NULL,       -- e.g., 'login', 'schedule_update', 'alert_resolve'
    resource_type   VARCHAR(50),                -- e.g., 'schedule', 'alert', 'user'
    resource_id     VARCHAR(100),               -- ID of affected resource
    details         JSONB,                      -- Additional context
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);


-- ============================================================
-- 2. METRO NETWORK (INFRASTRUCTURE)
-- ============================================================

-- Metro lines
CREATE TABLE metro_lines (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,       -- e.g., 'Red Line'
    color_code      VARCHAR(7),                         -- Hex color e.g., '#FF0000'
    total_stations  INTEGER DEFAULT 0,
    total_length_km DECIMAL(6,2),
    status          line_status NOT NULL DEFAULT 'operational',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stations
CREATE TABLE stations (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(10) UNIQUE,                 -- Short code e.g., 'RC' for Rajiv Chowk
    line_id         INTEGER NOT NULL REFERENCES metro_lines(id) ON DELETE RESTRICT,
    latitude        DECIMAL(10, 7) NOT NULL,
    longitude       DECIMAL(10, 7) NOT NULL,
    layout          station_layout NOT NULL DEFAULT 'elevated',
    zone            VARCHAR(10),
    distance_from_start_km DECIMAL(6,2),
    opened_date     DATE,
    max_capacity    INTEGER DEFAULT 5000,               -- Max safe occupancy
    warning_threshold INTEGER DEFAULT 3500,             -- Trigger warning at this level
    critical_threshold INTEGER DEFAULT 4500,            -- Trigger critical alert at this level
    is_interchange  BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stations_line ON stations(line_id);
CREATE INDEX idx_stations_name ON stations(name);
CREATE INDEX idx_stations_code ON stations(code);
CREATE INDEX idx_stations_location ON stations USING GIST (
    (point(longitude, latitude))
);

-- Station connections (graph edges for network topology)
CREATE TABLE station_connections (
    id              SERIAL PRIMARY KEY,
    from_station_id INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    to_station_id   INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    line_id         INTEGER NOT NULL REFERENCES metro_lines(id) ON DELETE CASCADE,
    distance_km     DECIMAL(6,2) NOT NULL,
    avg_travel_time_min DECIMAL(5,2) NOT NULL,
    is_bidirectional BOOLEAN DEFAULT TRUE,
    UNIQUE (from_station_id, to_station_id, line_id)
);

CREATE INDEX idx_connections_from ON station_connections(from_station_id);
CREATE INDEX idx_connections_to ON station_connections(to_station_id);

-- Interchange mappings (stations shared across lines)
CREATE TABLE station_interchanges (
    id              SERIAL PRIMARY KEY,
    station_a_id    INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    station_b_id    INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    transfer_time_min DECIMAL(4,2) DEFAULT 3.0,
    UNIQUE (station_a_id, station_b_id)
);


-- ============================================================
-- 3. TRAIN SCHEDULING
-- ============================================================

-- Trains (fleet)
CREATE TABLE trains (
    id              SERIAL PRIMARY KEY,
    train_number    VARCHAR(20) NOT NULL UNIQUE,
    line_id         INTEGER NOT NULL REFERENCES metro_lines(id) ON DELETE RESTRICT,
    capacity        INTEGER NOT NULL DEFAULT 1500,       -- Total passenger capacity
    coach_count     INTEGER DEFAULT 6,
    status          train_status NOT NULL DEFAULT 'in_service',
    last_maintenance DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trains_line ON trains(line_id);
CREATE INDEX idx_trains_status ON trains(status);

-- Base schedules (template schedules per day type)
CREATE TABLE schedules (
    id              BIGSERIAL PRIMARY KEY,
    train_id        INTEGER NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
    station_id      INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    stop_sequence   INTEGER NOT NULL,                    -- Order of stops
    arrival_time    TIME NOT NULL,
    departure_time  TIME NOT NULL,
    day_type        day_type NOT NULL DEFAULT 'weekday',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedules_train ON schedules(train_id);
CREATE INDEX idx_schedules_station ON schedules(station_id);
CREATE INDEX idx_schedules_day_type ON schedules(day_type);
CREATE INDEX idx_schedules_arrival ON schedules(arrival_time);

-- Dynamic schedule adjustments (when AI or operator modifies a schedule)
CREATE TABLE schedule_adjustments (
    id              BIGSERIAL PRIMARY KEY,
    schedule_id     BIGINT NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    original_arrival TIME NOT NULL,
    original_departure TIME NOT NULL,
    adjusted_arrival TIME NOT NULL,
    adjusted_departure TIME NOT NULL,
    reason          TEXT NOT NULL,                       -- e.g., 'AI: predicted overcrowding at Rajiv Chowk'
    status          adjustment_status NOT NULL DEFAULT 'proposed',
    proposed_by     UUID REFERENCES users(id),          -- NULL if AI-generated
    approved_by     UUID REFERENCES users(id),
    applied_at      TIMESTAMPTZ,
    valid_date      DATE NOT NULL,                      -- Date this adjustment applies to
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_adjustments_schedule ON schedule_adjustments(schedule_id);
CREATE INDEX idx_adjustments_status ON schedule_adjustments(status);
CREATE INDEX idx_adjustments_date ON schedule_adjustments(valid_date);


-- ============================================================
-- 4. CROWD MONITORING
-- ============================================================

-- Real-time station crowd readings (primary crowd data table)
CREATE TABLE crowd_readings (
    id              BIGSERIAL PRIMARY KEY,
    station_id      INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    timestamp       TIMESTAMPTZ NOT NULL,
    entry_count     INTEGER NOT NULL DEFAULT 0,          -- Entries in this interval
    exit_count      INTEGER NOT NULL DEFAULT 0,          -- Exits in this interval
    current_occupancy INTEGER NOT NULL DEFAULT 0,        -- Running total at station
    density_level   density_level NOT NULL DEFAULT 'low',
    source          VARCHAR(30) DEFAULT 'turnstile',     -- turnstile, ticketing, manual
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partition by month for performance with time-series data
CREATE INDEX idx_crowd_station_time ON crowd_readings(station_id, timestamp DESC);
CREATE INDEX idx_crowd_density ON crowd_readings(density_level);
CREATE INDEX idx_crowd_timestamp ON crowd_readings(timestamp DESC);

-- Turnstile-level readings (granular, for debugging and reconciliation)
CREATE TABLE turnstile_readings (
    id              BIGSERIAL PRIMARY KEY,
    station_id      INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    turnstile_id    VARCHAR(30) NOT NULL,                -- e.g., 'A002_R051_02-00-00'
    timestamp       TIMESTAMPTZ NOT NULL,
    entries_cumulative BIGINT,
    exits_cumulative   BIGINT,
    net_entries     INTEGER,                             -- Computed diff()
    net_exits       INTEGER,                             -- Computed diff()
    is_valid        BOOLEAN DEFAULT TRUE,                -- FALSE if counter reset detected
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_turnstile_station ON turnstile_readings(station_id);
CREATE INDEX idx_turnstile_id ON turnstile_readings(turnstile_id, timestamp DESC);


-- ============================================================
-- 5. TRIPS & TICKETING
-- ============================================================

CREATE TABLE trips (
    id              BIGSERIAL PRIMARY KEY,
    from_station_id INTEGER NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
    to_station_id   INTEGER NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
    trip_date       DATE NOT NULL,
    trip_time       TIME,
    passengers      INTEGER NOT NULL DEFAULT 1,
    ticket_type     ticket_type NOT NULL DEFAULT 'single',
    fare            DECIMAL(8,2),
    distance_km     DECIMAL(6,2),
    remarks         VARCHAR(50),                         -- peak, off-peak, festival, etc.
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trips_from ON trips(from_station_id);
CREATE INDEX idx_trips_to ON trips(to_station_id);
CREATE INDEX idx_trips_date ON trips(trip_date);
CREATE INDEX idx_trips_ticket_type ON trips(ticket_type);


-- ============================================================
-- 6. ALERTS & NOTIFICATIONS
-- ============================================================

-- Alert rules (configurable thresholds)
CREATE TABLE alert_rules (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    station_id      INTEGER REFERENCES stations(id) ON DELETE CASCADE,  -- NULL = applies to all stations
    alert_type      alert_type NOT NULL,
    severity        alert_severity NOT NULL DEFAULT 'medium',
    metric          VARCHAR(50) NOT NULL,               -- e.g., 'current_occupancy', 'delay_minutes'
    condition       VARCHAR(10) NOT NULL,               -- '>', '<', '>=', '<=', '=='
    threshold       DECIMAL(10,2) NOT NULL,
    cooldown_min    INTEGER DEFAULT 15,                  -- Don't re-fire within this window
    is_active       BOOLEAN DEFAULT TRUE,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alert_rules_type ON alert_rules(alert_type);
CREATE INDEX idx_alert_rules_active ON alert_rules(is_active);

-- Generated alerts
CREATE TABLE alerts (
    id              BIGSERIAL PRIMARY KEY,
    rule_id         INTEGER REFERENCES alert_rules(id) ON DELETE SET NULL,
    station_id      INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    alert_type      alert_type NOT NULL,
    severity        alert_severity NOT NULL,
    status          alert_status NOT NULL DEFAULT 'active',
    title           VARCHAR(200) NOT NULL,
    message         TEXT NOT NULL,
    metric_value    DECIMAL(10,2),                      -- The value that triggered the alert
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_by     UUID REFERENCES users(id),
    resolved_at     TIMESTAMPTZ,
    resolution_note TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_station ON alerts(station_id);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);


-- ============================================================
-- 7. AI PREDICTIONS
-- ============================================================

CREATE TABLE prediction_models (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,               -- e.g., 'crowd_lstm_v2', 'delay_xgboost_v1'
    model_type      VARCHAR(50) NOT NULL,                -- 'lstm', 'xgboost', 'prophet', 'random_forest'
    target_metric   VARCHAR(50) NOT NULL,                -- 'crowd_level', 'delay_minutes'
    version         VARCHAR(20) NOT NULL,
    accuracy_score  DECIMAL(5,4),                        -- e.g., 0.9245
    rmse            DECIMAL(10,4),
    model_path      VARCHAR(500),                        -- Path to saved model file
    is_active       BOOLEAN DEFAULT FALSE,               -- Only one active model per target
    trained_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE predictions (
    id              BIGSERIAL PRIMARY KEY,
    model_id        INTEGER NOT NULL REFERENCES prediction_models(id) ON DELETE CASCADE,
    station_id      INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    prediction_time TIMESTAMPTZ NOT NULL,                -- When the prediction was made
    target_time     TIMESTAMPTZ NOT NULL,                -- Time being predicted for
    predicted_value DECIMAL(10,2) NOT NULL,              -- e.g., predicted crowd count
    actual_value    DECIMAL(10,2),                       -- Filled in after the fact for accuracy tracking
    confidence      DECIMAL(5,4),                        -- 0.0 to 1.0
    features_used   JSONB,                               -- Snapshot of input features
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_predictions_station ON predictions(station_id);
CREATE INDEX idx_predictions_target_time ON predictions(target_time);
CREATE INDEX idx_predictions_model ON predictions(model_id);


-- ============================================================
-- 8. EXTERNAL DATA
-- ============================================================

CREATE TABLE weather_data (
    id              BIGSERIAL PRIMARY KEY,
    station_id      INTEGER REFERENCES stations(id) ON DELETE CASCADE,  -- NULL = city-wide
    timestamp       TIMESTAMPTZ NOT NULL,
    condition       weather_condition NOT NULL,
    temperature_c   DECIMAL(5,2),
    humidity_pct    DECIMAL(5,2),
    wind_speed_kmh  DECIMAL(5,2),
    precipitation_mm DECIMAL(6,2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weather_time ON weather_data(timestamp DESC);
CREATE INDEX idx_weather_station ON weather_data(station_id);

CREATE TABLE events (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    event_type      VARCHAR(50) NOT NULL,               -- 'sports', 'concert', 'festival', 'strike', 'public_holiday'
    event_date      DATE NOT NULL,
    start_time      TIME,
    end_time        TIME,
    location        VARCHAR(200),
    nearest_station_id INTEGER REFERENCES stations(id) ON DELETE SET NULL,
    expected_attendance INTEGER,
    impact_radius_km DECIMAL(5,2) DEFAULT 2.0,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_station ON events(nearest_station_id);


-- ============================================================
-- 9. ANALYTICS (PRE-AGGREGATED)
-- ============================================================

-- Daily station-level aggregates (materialized for dashboard performance)
CREATE TABLE daily_station_stats (
    id              BIGSERIAL PRIMARY KEY,
    station_id      INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    stat_date       DATE NOT NULL,
    total_entries   INTEGER NOT NULL DEFAULT 0,
    total_exits     INTEGER NOT NULL DEFAULT 0,
    peak_hour       SMALLINT,                           -- Hour with highest traffic (0-23)
    peak_count      INTEGER,                            -- Count during peak hour
    avg_occupancy   DECIMAL(10,2),
    max_occupancy   INTEGER,
    avg_density_level density_level,
    total_alerts    INTEGER DEFAULT 0,
    delay_minutes   DECIMAL(6,2) DEFAULT 0,
    UNIQUE (station_id, stat_date)
);

CREATE INDEX idx_daily_stats_station ON daily_station_stats(station_id);
CREATE INDEX idx_daily_stats_date ON daily_station_stats(stat_date);


-- ============================================================
-- 10. DATABASE TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_stations_updated_at
    BEFORE UPDATE ON stations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_metro_lines_updated_at
    BEFORE UPDATE ON metro_lines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_trains_updated_at
    BEFORE UPDATE ON trains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_alert_rules_updated_at
    BEFORE UPDATE ON alert_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- Auto-compute density_level from occupancy
CREATE OR REPLACE FUNCTION compute_density_level()
RETURNS TRIGGER AS $$
DECLARE
    max_cap INTEGER;
    warn_thresh INTEGER;
    crit_thresh INTEGER;
    ratio DECIMAL;
BEGIN
    -- Get station thresholds
    SELECT max_capacity, warning_threshold, critical_threshold
    INTO max_cap, warn_thresh, crit_thresh
    FROM stations WHERE id = NEW.station_id;

    IF max_cap IS NULL OR max_cap = 0 THEN
        NEW.density_level = 'low';
        RETURN NEW;
    END IF;

    IF NEW.current_occupancy >= crit_thresh THEN
        NEW.density_level = 'critical';
    ELSIF NEW.current_occupancy >= warn_thresh THEN
        NEW.density_level = 'high';
    ELSIF NEW.current_occupancy >= (max_cap * 0.5) THEN
        NEW.density_level = 'moderate';
    ELSE
        NEW.density_level = 'low';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_crowd_density_level
    BEFORE INSERT OR UPDATE ON crowd_readings
    FOR EACH ROW EXECUTE FUNCTION compute_density_level();


-- Auto-generate alert when crowd reading hits critical
CREATE OR REPLACE FUNCTION auto_generate_crowd_alert()
RETURNS TRIGGER AS $$
DECLARE
    station_name VARCHAR;
    last_alert_time TIMESTAMPTZ;
BEGIN
    -- Only trigger for high/critical
    IF NEW.density_level NOT IN ('high', 'critical') THEN
        RETURN NEW;
    END IF;

    -- Check cooldown: don't fire if an alert was created in last 15 min
    SELECT MAX(created_at) INTO last_alert_time
    FROM alerts
    WHERE station_id = NEW.station_id
      AND alert_type = 'overcrowding'
      AND created_at > NOW() - INTERVAL '15 minutes';

    IF last_alert_time IS NOT NULL THEN
        RETURN NEW;
    END IF;

    -- Get station name
    SELECT name INTO station_name FROM stations WHERE id = NEW.station_id;

    -- Create alert
    INSERT INTO alerts (station_id, alert_type, severity, status, title, message, metric_value)
    VALUES (
        NEW.station_id,
        'overcrowding',
        CASE WHEN NEW.density_level = 'critical' THEN 'critical'::alert_severity
             ELSE 'high'::alert_severity END,
        'active',
        CASE WHEN NEW.density_level = 'critical'
             THEN 'CRITICAL: ' || station_name || ' at maximum capacity'
             ELSE 'WARNING: High crowd density at ' || station_name END,
        'Station occupancy has reached ' || NEW.current_occupancy ||
        ' passengers (density: ' || NEW.density_level || '). Immediate attention required.',
        NEW.current_occupancy
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_crowd_alert
    AFTER INSERT ON crowd_readings
    FOR EACH ROW EXECUTE FUNCTION auto_generate_crowd_alert();


-- Update station total count on metro_lines when station is added/removed
CREATE OR REPLACE FUNCTION update_line_station_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE metro_lines SET total_stations = total_stations + 1 WHERE id = NEW.line_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE metro_lines SET total_stations = total_stations - 1 WHERE id = OLD.line_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.line_id != NEW.line_id THEN
        UPDATE metro_lines SET total_stations = total_stations - 1 WHERE id = OLD.line_id;
        UPDATE metro_lines SET total_stations = total_stations + 1 WHERE id = NEW.line_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_line_station_count
    AFTER INSERT OR UPDATE OR DELETE ON stations
    FOR EACH ROW EXECUTE FUNCTION update_line_station_count();


-- ============================================================
-- 11. SEED DATA (Default roles/permissions)
-- ============================================================

-- Default permissions
INSERT INTO permissions (resource, action, description) VALUES
    ('users', 'read', 'View user list and profiles'),
    ('users', 'write', 'Create and edit users'),
    ('users', 'delete', 'Delete users'),
    ('dashboard', 'read', 'View the main dashboard'),
    ('crowd', 'read', 'View crowd monitoring data'),
    ('crowd', 'write', 'Submit manual crowd readings'),
    ('schedules', 'read', 'View train schedules'),
    ('schedules', 'write', 'Create and edit schedules'),
    ('schedules', 'approve', 'Approve schedule changes'),
    ('alerts', 'read', 'View alerts'),
    ('alerts', 'write', 'Acknowledge and manage alerts'),
    ('alerts', 'configure', 'Create and edit alert rules'),
    ('analytics', 'read', 'View analytics and reports'),
    ('analytics', 'export', 'Export reports as CSV/PDF'),
    ('ai_models', 'read', 'View AI model performance'),
    ('ai_models', 'write', 'Train and deploy AI models');

-- Admin gets everything
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions;

-- Operator permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'operator', id FROM permissions
WHERE (resource, action) IN (
    ('dashboard', 'read'),
    ('crowd', 'read'), ('crowd', 'write'),
    ('schedules', 'read'), ('schedules', 'write'),
    ('alerts', 'read'), ('alerts', 'write'),
    ('analytics', 'read'), ('analytics', 'export'),
    ('ai_models', 'read')
);

-- Viewer permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'viewer', id FROM permissions
WHERE (resource, action) IN (
    ('dashboard', 'read'),
    ('crowd', 'read'),
    ('schedules', 'read'),
    ('alerts', 'read'),
    ('analytics', 'read')
);

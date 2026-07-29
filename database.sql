-- =====================================================================
-- MetroFlow – Metro Crowd Management and Scheduling Platform
-- PostgreSQL schema + seed data
--
-- Usage:
--   createdb metroflow          -- (or: CREATE DATABASE metroflow; from psql)
--   psql -d metroflow -f metroflow.sql
-- =====================================================================

-- Uncomment the two lines below if you are running this from a client
-- that is NOT already connected to the target database (e.g. plain psql
-- connected to "postgres"). Some hosted providers disallow CREATE DATABASE
-- inside scripts, so it's kept separate/optional.
-- CREATE DATABASE metroflow;
-- \c metroflow

-- Clean re-run support (drops in dependency order)
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS train_schedule CASCADE;
DROP TABLE IF EXISTS passenger_data CASCADE;
DROP TABLE IF EXISTS stations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================================
-- USERS
-- =====================================================================
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password      VARCHAR(255)  NOT NULL,     -- werkzeug password hash
    role          VARCHAR(20)   NOT NULL DEFAULT 'operator'
                  CHECK (role IN ('admin', 'operator')),
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- STATIONS
-- =====================================================================
CREATE TABLE stations (
    id            SERIAL PRIMARY KEY,
    station_name  VARCHAR(150)  NOT NULL UNIQUE,
    location      VARCHAR(200)  NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- PASSENGER DATA
-- =====================================================================
CREATE TABLE passenger_data (
    id             SERIAL PRIMARY KEY,
    station_id     INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    entry_count    INTEGER NOT NULL DEFAULT 0,
    exit_count     INTEGER NOT NULL DEFAULT 0,
    recorded_time  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_passenger_station ON passenger_data(station_id);
CREATE INDEX idx_passenger_time ON passenger_data(recorded_time);

-- =====================================================================
-- TRAIN SCHEDULE
-- =====================================================================
CREATE TABLE train_schedule (
    id              SERIAL PRIMARY KEY,
    train_name      VARCHAR(100) NOT NULL,
    station_id      INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    arrival_time    TIMESTAMP NOT NULL,
    departure_time  TIMESTAMP NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'Running'
                    CHECK (status IN ('Running', 'Delayed', 'Cancelled'))
);

CREATE INDEX idx_schedule_station ON train_schedule(station_id);

-- =====================================================================
-- ALERTS
-- =====================================================================
CREATE TABLE alerts (
    id           SERIAL PRIMARY KEY,
    station_id   INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    message      VARCHAR(255) NOT NULL,
    severity     VARCHAR(20) NOT NULL DEFAULT 'Info'
                 CHECK (severity IN ('Info', 'Warning', 'Critical')),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- Users (password hashes generated with werkzeug generate_password_hash)
-- admin@metroflow.com    / admin123
-- operator@metroflow.com / operator123
INSERT INTO users (name, email, password, role) VALUES
('System Admin', 'admin@metroflow.com',
 'scrypt:32768:8:1$x1ZgOnJV902dgbOR$4151813f1b9f7a6399709a1d67f997dfccabeeeb26cc116310100b973ce311fc04d35381b8c4efc616c969bb92a9280df6f8ecf5ac9f1b5ca50c4d5f6b2823e7',
 'admin'),
('Line Operator', 'operator@metroflow.com',
 'scrypt:32768:8:1$MsobbmATEyl3ixWN$5f44ad1861f93236227906fd7a336aec494c41a5c7b1dbf4a9f228c26f7a59a6bc99c30c8c3148a66a841f423c6bce95a1313caca3e81578949aea972ab4a426',
 'operator');

-- Stations
INSERT INTO stations (station_name, location) VALUES
('MG Road',        'Bengaluru Central'),
('Indiranagar',    'Bengaluru East'),
('Whitefield',     'Bengaluru East'),
('Yeshwanthpur',   'Bengaluru North'),
('Majestic',       'Bengaluru Central'),
('Electronic City', 'Bengaluru South');

-- Passenger Data (recent readings across stations)
INSERT INTO passenger_data (station_id, entry_count, exit_count, recorded_time) VALUES
(1, 420, 380, NOW() - INTERVAL '1 hour'),
(1, 610, 540, NOW() - INTERVAL '10 minutes'),
(2, 260, 240, NOW() - INTERVAL '1 hour'),
(2, 310, 290, NOW() - INTERVAL '10 minutes'),
(3, 520, 470, NOW() - INTERVAL '1 hour'),
(3, 700, 640, NOW() - INTERVAL '10 minutes'),
(4, 180, 150, NOW() - INTERVAL '1 hour'),
(4, 210, 190, NOW() - INTERVAL '10 minutes'),
(5, 800, 760, NOW() - INTERVAL '1 hour'),
(5, 980, 910, NOW() - INTERVAL '10 minutes'),
(6, 300, 260, NOW() - INTERVAL '1 hour'),
(6, 340, 300, NOW() - INTERVAL '10 minutes');

-- Train Schedule
INSERT INTO train_schedule (train_name, station_id, arrival_time, departure_time, status) VALUES
('Purple Line Express', 1, NOW() + INTERVAL '10 minutes', NOW() + INTERVAL '12 minutes', 'Running'),
('Green Line Local',    2, NOW() + INTERVAL '5 minutes',  NOW() + INTERVAL '7 minutes',  'Running'),
('Purple Line Express', 3, NOW() + INTERVAL '20 minutes', NOW() + INTERVAL '22 minutes', 'Delayed'),
('Green Line Local',    4, NOW() + INTERVAL '15 minutes', NOW() + INTERVAL '17 minutes', 'Running'),
('Yellow Line Shuttle', 5, NOW() + INTERVAL '3 minutes',  NOW() + INTERVAL '5 minutes',  'Delayed'),
('Yellow Line Shuttle', 6, NOW() + INTERVAL '25 minutes', NOW() + INTERVAL '27 minutes', 'Cancelled');

-- Alerts
INSERT INTO alerts (station_id, message, severity, created_at) VALUES
(5, 'Majestic reporting severe congestion – deploy additional staff', 'Critical', NOW() - INTERVAL '5 minutes'),
(3, 'Whitefield approaching high crowd density', 'Warning', NOW() - INTERVAL '20 minutes'),
(1, 'MG Road crowd levels rising steadily', 'Warning', NOW() - INTERVAL '30 minutes');

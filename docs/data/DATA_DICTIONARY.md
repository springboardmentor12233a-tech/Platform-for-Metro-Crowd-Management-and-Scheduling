# Data Dictionary

> **Last Updated:** July 7, 2026

This document defines every column in every dataset used by MetroFlow.

---

## 1. Delhi Metro Ticketing Data

**File:** `data/ticketing/delhi_metro_updated.csv`  
**Rows:** 150,000 | **Date Range:** Jan 2022 – Dec 2024

| Column | Type | Description | Sample Value |
|--------|------|-------------|-------------|
| `TripID` | int | Unique trip identifier | 59771 |
| `Date` | date | Trip date (YYYY-MM-DD) | 2022-05-08 |
| `From_Station` | string | Origin station name | Inderlok |
| `To_Station` | string | Destination station name | Kashmere Gate |
| `Distance_km` | float | Trip distance in km | 12.94 |
| `Fare` | float | Fare charged (INR) | 77.99 |
| `Cost_per_passenger` | float | Per-passenger cost (INR) | 18.27 |
| `Passengers` | float | Number of passengers in group | 13.0 |
| `Ticket_Type` | string | Fare medium used | Smart Card, Single, Tourist Card, Return |
| `Remarks` | string | Trip context flag | peak, off-peak, festival, maintenance, weekend |

**Missing Values:** Passengers (1%), Ticket_Type (1%), Remarks (17%)

---

## 2. MTA Subway Turnstile Usage Data

**File:** `data/entry_exit/MTA_Subway_Turnstile_Usage_Data__2022_20260701.csv`  
**Rows:** ~10,963,252 | **Date Range:** Dec 2022+

| Column | Type | Description | Sample Value |
|--------|------|-------------|-------------|
| `C/A` | string | Control Area (station identifier) | A002 |
| `Unit` | string | Remote unit ID for a station | R051 |
| `SCP` | string | Subunit Channel Position (specific turnstile) | 02-00-00 |
| `Line Name` | string | Subway lines served (concatenated) | NQR456W |
| `Division` | string | Operating division | BMT, IND, IRT |
| `Date` | date | Date of reading (MM/DD/YYYY) | 12/30/2022 |
| `Time` | time | Time of reading (4-hour intervals) | 03:00:00 |
| `Description` | string | Type of reading | REGULAR, RECOVR AUD |
| `Entries` | int | **Cumulative** entry counter for this turnstile | 7,811,029 |
| `Exits` | int | **Cumulative** exit counter for this turnstile | 2,770,909 |

**⚠️ Critical Note:** Entries and Exits are **cumulative odometer-style counters**. Actual ridership = `diff()` per turnstile (`C/A` + `Unit` + `SCP` group). Negative values and spikes > 10,000 per reading indicate counter resets and must be filtered.

---

## 3. TfL Entry & Exit Data

**Folder:** `data/entry_exit/TFL Entry and Exit Data/`

### 3a. TfL_stations.csv

| Column | Type | Description | Sample Value |
|--------|------|-------------|-------------|
| `NLC` | int | National Location Code | 500 |
| `Station` | string | Station name | Acton Town |
| `En/Ex 2007` – `En/Ex 2021` | float | Annual entry/exit counts per year | 5,773,625 |
| `LINES` | string | Lines serving the station | District, Piccadilly |
| `NETWORK` | string | Network category | London Underground |
| `London Underground` | string | Is on LU? | Yes/No |
| `Elizabeth Line` | string | Is on Elizabeth Line? | Yes/No |
| `London Overground` | string | Is on Overground? | Yes/No |
| `DLR` | string | Is on DLR? | Yes/No |
| `Night Tube?` | string | Has Night Tube service? | Yes/No |

### 3b. Stations_20220221.csv (Geodata)

| Column | Type | Description | Sample Value |
|--------|------|-------------|-------------|
| `NLC` | int | National Location Code | 500 |
| `NAME` | string | Station name | Acton Town |
| `EASTING` | int | OS Easting coordinate | 519478 |
| `NORTHING` | int | OS Northing coordinate | 179592 |
| `x` | float | Longitude | -0.278432 |
| `y` | float | Latitude | 51.502137 |
| `Zone` | string | Fare zone | 3 |
| `LINES` | string | Lines at station | District, Piccadilly |

---

## 4. TfL Journeys by Transport Type

**File:** `data/ridership/tfl-journeys-type.csv`  
**Date Range:** Apr 2010 – May 2026

| Column | Type | Description | Sample Value |
|--------|------|-------------|-------------|
| `Period and Financial year` | string | TfL period code | 01_10/11 |
| `Reporting Period` | int | Period number (1–13) | 1 |
| `Days in period` | int | Length of reporting period | 31 |
| `Period beginning` | date | Period start date | 01-Apr-10 |
| `Period ending` | date | Period end date | 01-May-10 |
| `Bus journeys (m)` | float | Millions of bus journeys | 189.1 |
| `Underground journeys (m)` | float | Millions of Tube journeys | 90.5 |
| `DLR Journeys (m)` | float | Millions of DLR journeys | 6.3 |
| `Tram Journeys (m)` | float | Millions of tram journeys | 2.3 |
| `Overground Journeys (m)` | float | Millions of Overground journeys | — |
| `London Cable Car Journeys (m)` | float | Millions of cable car journeys | — |
| `TfL Rail Journeys (m)` | float | Millions of TfL Rail journeys | — |

---

## 5. Delhi Metro Network Dynamics

**File:** `data/network_dynamics/Delhi-Metro-Network.csv`

| Column | Type | Description | Sample Value |
|--------|------|-------------|-------------|
| `Station ID` | int | Unique station identifier | 1 |
| `Station Name` | string | Station name | Jhil Mil |
| `Distance from Start (km)` | float | Distance from line start | 10.3 |
| `Line` | string | Metro line color/name | Red line |
| `Opening Date` | date | Station opening date | 2008-04-06 |
| `Station Layout` | string | Station type | Elevated, Underground |
| `Latitude` | float | GPS latitude | 28.67579 |
| `Longitude` | float | GPS longitude | 77.31239 |

---

## 6. Indian Railways Schedule Data

**Folder:** `data/schedules/`

### 6a. stations.json (GeoJSON FeatureCollection)
- **Records:** 8,990 stations
- **Properties:** `name`, `code`, `state`, `zone`, `address`
- **Geometry:** Point (longitude, latitude)

### 6b. trains.json (GeoJSON FeatureCollection)
- **Records:** 5,208 trains
- **Properties:** `name`, `zone`, `from_station_code`, `arrival`, `departure`, `third_ac`, `chair_car`, etc.
- **Geometry:** LineString (route coordinates)

### 6c. schedules.json
- **Size:** 79 MB
- **Content:** Full schedule data with stop-level timing for all trains

---

## 7. Transport Delays with Weather & Events

**File:** `data/delays/public_transport_delays.csv`  
**⚠️ Synthetic dataset**

| Column | Type | Description | Sample Value |
|--------|------|-------------|-------------|
| `trip_id` | string | Trip identifier | T00000 |
| `date` | date | Trip date | 2023-01-01 |
| `time` | time | Trip time | 05:00:00 |
| `transport_type` | string | Mode of transport | Metro, Bus, Tram |
| `route_id` | string | Route identifier | Route_15 |
| `origin_station` | string | Origin station | Station_31 |
| `destination_station` | string | Destination station | Station_6 |
| `scheduled_departure` | time | Planned departure | 05:02:00 |
| `scheduled_arrival` | time | Planned arrival | 05:55:00 |
| `actual_departure_delay_min` | int | Departure delay in minutes | 12 |
| `actual_arrival_delay_min` | int | Arrival delay in minutes | 3 |
| `weather_condition` | string | Weather at time of trip | Storm, Rain, Clear, Fog, Snow |
| `temperature_C` | float | Temperature in °C | 5.1 |
| `humidity_percent` | int | Humidity % | 52 |
| `wind_speed_kmh` | int | Wind speed in km/h | 46 |
| `precipitation_mm` | float | Precipitation in mm | 13.0 |
| `event_type` | string | Nearby event type | None, Sports, Concert, Strike |
| `event_attendance_est` | int | Estimated event attendance | 500 |
| `traffic_congestion_index` | int | Congestion index (0–100) | 81 |
| `holiday` | int | Is it a public holiday? (0/1) | 0 |
| `peak_hour` | int | Is it peak hour? (0/1) | 1 |
| `weekday` | int | Day of week (0=Mon, 6=Sun) | 6 |
| `season` | string | Season | Winter, Spring, Summer, Autumn |
| `delayed` | int | Was the trip delayed? (0/1) | 0 |

---

## 8. MetroPT-3 Sensor Data

**File:** `data/sensor/MetroPT3(AirCompressor).csv`  
**⚠️ Mechanical sensor data, not passenger data**

| Column | Type | Description | Sample Value |
|--------|------|-------------|-------------|
| `timestamp` | datetime | Reading timestamp (10-sec intervals) | 2020-02-01 00:00:00 |
| `TP2` | float | Pressure measurement 2 | -0.012 |
| `TP3` | float | Pressure measurement 3 | 9.358 |
| `H1` | float | Pressure measurement H1 | 9.34 |
| `DV_pressure` | float | Differential valve pressure | -0.024 |
| `Reservoirs` | float | Reservoir pressure | 9.358 |
| `Oil_temperature` | float | Oil temperature (°C) | 53.6 |
| `Motor_current` | float | Motor current (A) | 0.04 |
| `COMP` | float | Compressor status (binary) | 1.0 |
| `DV_eletric` | float | Electric valve status | 0.0 |
| `Towers` | float | Tower status | 1.0 |
| `MPG` | float | MPG status | 1.0 |
| `LPS` | float | Low pressure switch | 0.0 |
| `Pressure_switch` | float | Pressure switch status | 1.0 |
| `Oil_level` | float | Oil level status | 1.0 |
| `Caudal_impulses` | float | Flow rate impulses | 1.0 |

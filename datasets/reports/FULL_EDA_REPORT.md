# Metro Crowd Management & Scheduling Platform
# Comprehensive EDA Report — Final (Post-Preprocessing)

> **Generated:** 2026-07-09 | **Status:** Final · Production-Ready
> **Milestone:** M1 Complete — Ready for Feature Engineering & ML

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Dataset Inventory](#dataset-inventory)
3. [Dataset 1 — Delay (delay.csv)](#1-delay)
4. [Dataset 2 — Entry/Exit (entry-exit.xls)](#2-entryexit)
5. [Dataset 3 — AC2020 Annual Entry/Exit](#3-ac2020-annual-entryexit)
6. [Dataset 4 — GPS Status (Metro Stations)](#4-gps-status)
7. [Dataset 5 — Train Occupancy (Metro Stations)](#5-train-occupancy)
8. [Dataset 6 — Ridership](#6-ridership)
9. [Dataset 7 — Schedules (schedules.json)](#7-schedules)
10. [Dataset 8 — Sensor Data](#8-sensor-data)
11. [Dataset 9 — Stations (stations.json)](#9-stations)
12. [Dataset 10 — Ticketing](#10-ticketing)
13. [Dataset 11 — Trains (trains.json)](#11-trains)
14. [Cross-Dataset Analysis](#cross-dataset-analysis)
15. [Feature Engineering Roadmap](#feature-engineering-roadmap)
16. [ML Readiness Assessment](#ml-readiness-assessment)
17. [Risks and Recommendations](#risks-and-recommendations)

---

## Executive Summary

All **11 raw datasets** have been ingested, validated, cleaned, and saved to `processed/`. The full
preprocessing pipeline runs in **~60 seconds** end-to-end. No dataset failed preprocessing.

| Dataset | Raw Rows | Processed Rows | Columns | Missing % | Duplicates |
|---------|----------|----------------|---------|-----------|------------|
| delay | 2,000 | 2,000 | 36 | 0% | 0 |
| entry_exit | 3,000+ | 2,953 | 22 | Note field only | 0 |
| ac2020_entry_exit | 426 | 426 | 17 | 0.4% (numeric medians) | 0 |
| gps | 49 | 49 | 11 | 0% | 0 |
| occupancy | 285 | 285 | 11 | 0% | 0 |
| ridership | 9 | 9 | 11 | 1 (expected: first YoY) | 0 |
| schedules | 417,080 | 417,080+ | 21 | Arrival/Departure (valid) | 0 |
| sensor | ~1.7M | ~1.7M | 28 | 0% | 0 |
| stations | 8,990 | 8,990 | 15 | 709 (address/zone) | 0 |
| ticketing | ~100K | ~100K | 22 | 0% | 0 |
| trains | 5,208 | 5,208 | 41 | Route/speed (valid) | 0 |

**Key finding:** All missing values are either structurally expected (origin/terminus stop times,
first-row YoY growth) or have been correctly imputed (medians, modes, unknowns). Zero data quality
blockers remain.

---

## Dataset Inventory

```
datasets/
├── raw/                              ← 11 original source files (NEVER modify)
│   ├── AC2020_AnnualisedEntryExit.xlsx   85 KB
│   ├── delay.csv                         268 KB
│   ├── entry-exit.xls                    3.2 MB
│   ├── gps-status.csv                    22 KB
│   ├── metro-sensordata.csv              218 MB   ← largest file
│   ├── ridership.csv                     774 B
│   ├── schedules.json                    82 MB
│   ├── stations.json                     1.8 MB
│   ├── ticketing.csv                     12.9 MB
│   ├── train-occupancy.csv               22 KB
│   └── trains.json                       14.8 MB
└── processed/                        ← 11 clean CSVs ready for ML
    ├── delay_preprocessed.csv            353 KB
    ├── entry_exit_preprocessed.csv       367 KB
    ├── ac2020_entry_exit_preprocessed.csv 84 KB
    ├── gps_preprocessed.csv              4.2 KB
    ├── occupancy_preprocessed.csv        25 KB
    ├── ridership_preprocessed.csv        750 B
    ├── schedules_preprocessed.csv        43.5 MB
    ├── sensor_preprocessed.csv           246 MB
    ├── stations_preprocessed.csv         814 KB
    ├── ticketing_preprocessed.csv        21.5 MB
    └── trains_preprocessed.csv           1.4 MB
```

---

## 1. Delay

**Source:** `raw/delay.csv` | **Script:** `scripts/preprocessing/preprocess_delay.py`
**Output:** `processed/delay_preprocessed.csv` — 2,000 rows × 36 columns

### Schema

| Column | Type | Description |
|--------|------|-------------|
| trip_id | object | Unique trip identifier |
| date | object | Trip date (YYYY-MM-DD) |
| transport_type | object | Mode of transport |
| route_id | object | Route identifier |
| origin_station / destination_station | object | Start/end stations |
| actual_departure_delay_min | int64 | Departure delay in minutes |
| actual_arrival_delay_min | int64 | Arrival delay in minutes |
| weather_condition | object | Weather at trip time |
| temperature_c | float64 | Temperature in Celsius |
| humidity_percent | float64 | Relative humidity (0–100) |
| wind_speed_kmh | float64 | Wind speed |
| precipitation_mm | float64 | Rainfall |
| event_type | object | Special event if any |
| event_attendance_est | int64 | Estimated event attendance |
| traffic_congestion_index | float64 | Traffic congestion (0–100) |
| is_delayed_5min | int8 | **[Derived]** Binary: delay > 5 min |
| year / month / day_of_week / is_weekend | int | **[Derived]** Temporal features |
| *_outlier | int8 | **[Derived]** IQR outlier flags |

### Quality Assessment

- **Missing values:** 0 — all handled during preprocessing
- **Duplicates:** 0 (deduplicated on `trip_id`)
- **Domain validation:** Delays clipped to [-60, 240] min; humidity to [0,100]; congestion to [0,100]
- **Outlier flags:** Present for delays, event_attendance, traffic_congestion

### Key Findings

- Dataset spans multiple weather conditions and event types — excellent for delay prediction modelling
- `is_delayed_5min` binary target is ready for classification models
- Temporal features (year, month, day_of_week, is_weekend) fully extracted

### ML Readiness: ✅ Ready for delay prediction model

---

## 2. Entry/Exit

**Source:** `raw/entry-exit.xls` | **Script:** `scripts/preprocessing/preprocess_entry_exit.py`
**Output:** `processed/entry_exit_preprocessed.csv` — 2,953 rows × 22 columns

### Schema

| Column | Type | Description |
|--------|------|-------------|
| station_nlc | float64 | Station NLC code |
| station | object | Station name |
| borough | object | London borough |
| note | object | Annotation (sparse — expected) |
| weekday / saturday / sunday | float64 | Entry/exit counts by day type |
| source_sheet | object | Source year-sheet |
| year | float64 | Data year |
| *_outlier | int8 | **[Derived]** IQR outlier flags |

### Quality Assessment

- **Missing values:** 2,697 in `note` column — this is a free-text annotation field and is
  legitimately sparse. No imputation needed; this column is excluded from ML features.
- **Duplicates:** 0
- **Year range:** 2007–2017 (10 years of London Underground station usage data)

### Key Findings

- Multi-year dataset suitable for trend analysis and time-series modelling
- `weekday_net_flow` (entries − exits) is derived — useful for crowd pressure modelling
- Station-level annual ridership data for London Underground stations

### ML Readiness: ✅ Ready for station demand forecasting

---

## 3. AC2020 Annual Entry/Exit

**Source:** `raw/AC2020_AnnualisedEntryExit.xlsx` | **Script:** `preprocess_ac2020_entry_exit.py`
**Output:** `processed/ac2020_entry_exit_preprocessed.csv` — 426 rows × 17 columns

### Schema

| Column | Type | Description |
|--------|------|-------------|
| mode | object | Transport mode |
| nlc | int64 | National location code |
| station | object | Station name |
| coverage | object | Coverage type |
| entries / exits | float64 | Weekday Mon–Thu counts |
| *_friday / *_saturday / *_sunday | float64 | Day-type breakdowns |
| weekday_net_flow | float64 | **[Derived]** Entries − Exits |
| data_year | int | **[Derived]** Constant: 2020 |
| *_outlier | int8 | **[Derived]** IQR outlier flags |

### Quality Assessment

- **Missing values:** 18 (in numeric station count columns — filled with median)
- **Duplicates:** 0 (deduplicated on nlc + station)
- **Domain filter:** `annualised_entry_exit >= 0` enforced

### ML Readiness: ✅ Ready for station-level demand cross-validation

---

## 4. GPS Status

**Source:** `raw/gps-status.csv` | **Script:** `preprocess_gps.py`
**Output:** `processed/gps_preprocessed.csv` — 49 rows × 11 columns

### Schema

| Column | Type | Description |
|--------|------|-------------|
| station_id | int64 | Unique station identifier |
| station_name | object | Station name |
| distance_from_start_km | float64 | Distance along metro line |
| line | object | Metro line name |
| opening_date | object | Date station opened (YYYY-MM-DD) |
| station_layout | object | Elevated / Underground / At-Grade |
| latitude / longitude | float64 | Geographic coordinates |
| coord_invalid | int8 | **[Derived]** Coordinate validity flag |
| opening_year | int | **[Derived]** Year opened |

### Quality Assessment

- **Missing values:** 0
- **Duplicates:** 0 (deduplicated on station_id)
- **Coordinate validation:** All 49 stations validated within India bounding box

> **Note:** This file is a **static 49-station metro reference file**, NOT real-time GPS data.

### ML Readiness: ✅ Ready as geographic lookup/join key

---

## 5. Train Occupancy

**Source:** `raw/train-occupancy.csv` | **Script:** `preprocess_occupancy.py`
**Output:** `processed/occupancy_preprocessed.csv` — 285 rows × 11 columns

### Schema

Identical to GPS schema (same column structure). Contains **285 Delhi metro stations**.

### Quality Assessment

- **Missing values:** 0
- **Duplicates:** 0
- **Date format:** `%d/%m/%Y` correctly parsed (fixed in preprocessing script)
- **Coordinate validation:** All stations validated within India bounding box

> **Note:** This file is a **static 285-station metro directory** — NOT real-time occupancy data.
> The name is misleading. It stores station metadata (layout, coordinates, line allocation).

### ML Readiness: ✅ Ready as station reference table for spatial feature engineering

---

## 6. Ridership

**Source:** `raw/ridership.csv` | **Script:** `preprocess_ridership.py`
**Output:** `processed/ridership_preprocessed.csv` — 9 rows × 11 columns

### Schema

| Column | Type | Description |
|--------|------|-------------|
| id | int64 | Row identifier |
| year | object | Financial year (e.g. "2011/12") |
| ridership | int64 | Annual passenger count |
| operational_route_km | float64 | Route km in operation |
| rolling_stock_num_cars | int64 | Fleet size (number of cars) |
| year_label | object | **[Derived]** Cleaned year string |
| start_year | int64 | **[Derived]** 4-digit start year |
| ridership_yoy_growth_pct | float64 | **[Derived]** Year-on-year growth % |

### Quality Assessment

- **Missing values:** 1 — in `ridership_yoy_growth_pct` for the first row (mathematically
  correct: no prior year to compare against)
- **Duplicates:** 0

### Key Findings

- Only 9 records (annual aggregates) — too small for standalone ML; used as a macro feature
- YoY growth range: -68% to +187% — reflects post-COVID disruption patterns

### ML Readiness: ✅ Ready as macro-level feature for demand context

---

## 7. Schedules

**Source:** `raw/schedules.json` | **Script:** `preprocess_schedules.py`
**Output:** `processed/schedules_preprocessed.csv` — 417,080+ rows × 21 columns

### Schema

| Column | Type | Description |
|--------|------|-------------|
| id | int64 | Stop record ID |
| day | int16 | Day of week (1–13 encoding) |
| train_number | object | Train identifier |
| train_name | object | Train name |
| station_name / station_code | object | Stop station |
| arrival / departure | object | Scheduled times (HH:MM) |
| arrival_min / departure_min | float64 | **[Derived]** Minutes since midnight |
| is_arrival_missing / is_departure_missing | int8 | **[Derived]** Origin/terminus flags |
| departure_hour / arrival_hour | Int16 | **[Derived]** Hour of day |
| is_peak_departure | int8 | **[Derived]** Peak hours 7-9h, 17-19h |
| is_origin_stop / is_terminus_stop | int8 | **[Derived]** Journey endpoint flags |
| stop_sequence | int64 | **[Derived]** Position in journey |
| dwell_min | float64 | **[Derived]** Time at station (minutes) |

### Quality Assessment

- **Missing values:** Arrival/departure nulls are **structurally valid** — origin stops have no
  arrival, terminus stops have no departure. These are correctly flagged.
- **Duplicates:** 0 (deduplicated on `id`)
- **Scale:** 417,080 stop records, 5,208 unique trains, 8,495 unique stations

### Key Findings

- 24.9% of departures fall within peak hours (07:00–09:59 and 17:00–19:59)
- Station popularity follows a power-law (Zipf) distribution
- Median stops per train: 51; Maximum: 698 stops (ultra-long routes)
- `dwell_min` nullified where departure < arrival (invalid sequence)

### ML Readiness: ✅ Ready for schedule optimisation and delay correlation

---

## 8. Sensor Data

**Source:** `raw/metro-sensordata.csv` (218 MB) | **Script:** `preprocess_sensor.py`
**Output:** `processed/sensor_preprocessed.csv` — ~1.7M rows × 28 columns

### Schema

| Column | Type | Description |
|--------|------|-------------|
| source_row_id | int64 | Original row index |
| timestamp | object | Sensor reading timestamp |
| tp2, tp3 | float64 | Temperature/pressure readings |
| h1 | float64 | Humidity sensor |
| dv_pressure | float64 | Differential valve pressure |
| reservoirs | float64 | Reservoir level |
| oil_temperature | float64 | Oil temperature |
| motor_current | float64 | Motor current draw |
| comp, dv_eletric, towers, mpg, lps | float64 | Compressor and auxiliary sensors |
| pressure_switch, oil_level, caudal_impulses | float64 | Binary/pulse sensors |
| year / month / day / hour | int | **[Derived]** Temporal features |
| *_outlier | int8 | **[Derived]** IQR outlier flags |

### Quality Assessment

- **Missing values:** 0 (all medians filled; NaT timestamps dropped)
- **Duplicates:** 0 (deduplicated on timestamp + source_row_id)
- **Sorted:** By timestamp for time-series integrity

### Key Findings

- This is **compressor/pneumatic system sensor data** — useful for predictive maintenance
- Binary sensor columns (pressure_switch, oil_level) excluded from outlier detection
- Temporal granularity: hourly resolution across multiple years

### ML Readiness: ✅ Ready for anomaly detection and predictive maintenance models

---

## 9. Stations

**Source:** `raw/stations.json` (GeoJSON) | **Script:** `preprocess_stations.py`
**Output:** `processed/stations_preprocessed.csv` — 8,990 rows × 15 columns

### Schema

| Column | Type | Description |
|--------|------|-------------|
| station_code | object | Unique station code (uppercase) |
| station_name | object | Station name |
| state | object | Indian state |
| zone | object | Railway zone |
| address | object | Station address |
| geometry_type | object | GeoJSON geometry type |
| longitude / latitude | float64 | WGS84 coordinates |
| coord_invalid | int8 | **[Derived]** Invalid coordinate flag |
| code_length | int64 | **[Derived]** Length of station code |
| name_word_count | int64 | **[Derived]** Word count of name |
| is_junction | int8 | **[Derived]** Junction station flag |
| is_road_station | int8 | **[Derived]** Road station flag |

### Quality Assessment

- **Missing values:** 709 — distributed across `address` (sparse) and `zone`/`state` (some
  stations lack administrative metadata). Filled with "Unknown".
- **Duplicates:** 0 (deduplicated on station_code)
- **Coordinate validation:** India bounding box (6–37.5°N, 68–98°E)

### Key Findings

- 8,990 Indian railway stations — comprehensive national coverage
- Junction stations (containing "Jn" or "Junction") are flagged for routing models
- Geographic distribution suitable for spatial clustering and route optimisation

### ML Readiness: ✅ Ready for station clustering and geographic feature engineering

---

## 10. Ticketing

**Source:** `raw/ticketing.csv` | **Script:** `preprocess_ticketing.py`
**Output:** `processed/ticketing_preprocessed.csv` — ~100K rows × 22 columns

### Schema

| Column | Type | Description |
|--------|------|-------------|
| tripid | int64 | Trip identifier |
| date | object | Transaction date (YYYY-MM-DD) |
| from_station / to_station | object | Origin–destination pair |
| distance_km | float64 | Journey distance |
| fare | float64 | Fare charged |
| cost_per_passenger | float64 | Cost breakdown |
| passengers | int64 | Passenger count |
| ticket_type | object | Ticket category |
| fare_per_km | float64 | **[Derived]** Rate per km |
| total_revenue | float64 | **[Derived]** Fare × passengers |
| cost_exceeds_fare | int8 | **[Derived]** Anomaly flag |
| year / month / day_of_week / is_weekend | int | **[Derived]** Temporal features |
| od_pair | object | **[Derived]** Origin→Destination string |

### Quality Assessment

- **Missing values:** 0
- **Duplicates:** 0 (deduplicated on tripid)
- **Domain validation:** distance in [0.1, 100] km; fare in [1, 500]; passengers in [1, 100]

### Key Findings

- `cost_exceeds_fare` flags anomalous transactions where operational cost > fare revenue
- `od_pair` enables origin-destination matrix construction for crowd flow modelling
- Weekend vs weekday split useful for demand pattern modelling

### ML Readiness: ✅ Ready for demand forecasting and fare anomaly detection

---

## 11. Trains

**Source:** `raw/trains.json` (GeoJSON) | **Script:** `preprocess_trains.py`
**Output:** `processed/trains_preprocessed.csv` — 5,208 rows × 41 columns

### Schema (Key Columns)

| Column | Type | Description |
|--------|------|-------------|
| train_number | object | Unique train identifier |
| train_name | object | Train name |
| zone | object | Railway zone |
| from_station_name / to_station_name | object | Origin / Destination |
| duration_m | float64 | Journey duration (minutes) |
| distance | float64 | Official distance (km) |
| third_ac / second_ac / first_ac | int8 | Class availability flags |
| chair_car / sleeper / first_class | int8 | Class availability flags |
| route_distance_km | float64 | **[Derived]** Haversine distance |
| avg_speed_kmh | float64 | **[Derived]** Average speed |
| train_type | object | **[Derived]** Service category |
| num_classes | int64 | **[Derived]** Number of classes offered |
| is_peak_departure | int8 | **[Derived]** Peak hour departure |
| speed_invalid | int8 | **[Derived]** Speed anomaly flag |

### Quality Assessment

- **Missing values:** `classes` (5,208) — free-text field from JSON; excluded from features.
  `return_train` (599) — many trains have no return pairing (valid). `avg_speed_kmh` (452) —
  trains with invalid/missing coordinates cannot have speed calculated (correctly nulled).
- **Duplicates:** 0 (deduplicated on train_number)
- **Speed validation:** Speeds outside [5, 300] km/h flagged as `speed_invalid`

### Key Findings

- 10 train service types identified: Rajdhani, Shatabdi, Duronto, Express, Mail, Passenger, etc.
- Haversine distance vs official distance discrepancy identifies non-linear routes
- `num_classes` correlates with service grade (premium trains offer more classes)

### ML Readiness: ✅ Ready for train type classification and route optimisation

---

## Cross-Dataset Analysis

### Join Coverage

| Join | Key | Coverage |
|------|-----|----------|
| schedules ↔ stations | station_code | ~94% of schedule stops match station records |
| schedules ↔ trains | train_number | ~100% of scheduled trains in trains dataset |
| ticketing ↔ stations | station_name | ~85% (name normalisation applied) |
| gps ↔ occupancy | station_id | Different datasets — not designed to join |

### Dataset Size Comparison

| Dataset | Records | Notes |
|---------|---------|-------|
| sensor_preprocessed | ~1.7M | Largest — time-series sensor readings |
| schedules_preprocessed | 417,080 | Second largest — stop-level records |
| stations_preprocessed | 8,990 | National station directory |
| trains_preprocessed | 5,208 | Train fleet directory |
| ticketing_preprocessed | ~100K | Transaction records |
| delay_preprocessed | 2,000 | Delay events with weather |
| entry_exit_preprocessed | 2,953 | London Underground annual counts |
| occupancy_preprocessed | 285 | Delhi metro stations |
| ac2020_entry_exit | 426 | 2020 annual snapshot |
| gps_preprocessed | 49 | Small metro line reference |
| ridership_preprocessed | 9 | Annual aggregates |

### Potential ML Feature Joins

```python
# Primary crowd prediction join
delay + schedules + trains + stations → crowd pressure model

# Revenue and demand join  
ticketing + entry_exit + ridership → demand forecasting model

# Infrastructure join
gps + occupancy + stations → spatial clustering model

# Anomaly detection
sensor → predictive maintenance model (standalone)
```

---

## Feature Engineering Roadmap

The following features are recommended for **Milestone 2 — Feature Engineering**:

### Time-Based Features
- Hour-of-day, day-of-week, month, season (already in delay, ticketing, sensor)
- Peak/off-peak flag (already in schedules, trains, delay)
- Holiday indicator (already in delay)
- Days since station opened (from gps/occupancy `opening_year`)

### Spatial Features
- Haversine distance between stations (already in trains)
- Station zone / state / line encoding (from stations, gps)
- Coordinate clustering labels (k-means on lat/lon)
- Network centrality score (from schedules stop frequency)

### Demand Features
- Origin–destination trip volume (from ticketing `od_pair`)
- Station entry/exit net flow (from entry_exit `weekday_net_flow`)
- Annualised ridership per station (from ac2020_entry_exit)
- Stop frequency rank (from schedules — stops per station)

### Operational Features
- Train type encoding (already in trains `train_type`)
- Number of classes (already in trains `num_classes`)
- Dwell time statistics per station (from schedules `dwell_min`)
- Average delay by route (from delay `route_id`)
- Revenue per km (already in ticketing `fare_per_km`)

### Derived Crowd Indicators
- Congestion risk score = f(delay, occupancy, peak_hour)
- Station load factor = actual_passengers / theoretical_capacity
- Route efficiency score = avg_speed / expected_speed

---

## ML Readiness Assessment

| ML Task | Primary Datasets | Features Available | Status |
|---------|------------------|--------------------|--------|
| Delay Prediction | delay | Weather, time, route | ✅ Ready |
| Crowd Density Forecasting | schedules, ticketing, entry_exit | Temporal, spatial, demand | ✅ Ready |
| Anomaly Detection | sensor | Multivariate time-series | ✅ Ready |
| Station Clustering | stations, gps, occupancy | Geo-coordinates, zone | ✅ Ready |
| Train Type Classification | trains | Route, speed, classes | ✅ Ready |
| Demand Forecasting | ticketing, ridership, entry_exit | OD matrix, temporal | ✅ Ready |
| Schedule Optimisation | schedules, trains, delay | Stop sequence, dwell time | ✅ Ready |

---

## Risks and Recommendations

### Data Risks

| Risk | Severity | Affected Dataset | Mitigation |
|------|----------|------------------|------------|
| GPS/Occupancy misleading names | Low | gps, occupancy | Documented — both are static station directories |
| Sensor data volume (246 MB CSV) | Medium | sensor | Sample or chunk-load for EDA; use Parquet for ML |
| schedules.json is 82 MB | Medium | schedules | Already preprocessed to CSV; use chunked reads |
| Ridership only 9 rows | Low | ridership | Use as macro context feature, not standalone |
| Entry/exit `note` column (91% null) | Low | entry_exit | Drop from ML features |

### Recommendations for Milestone 2

1. **Convert large processed CSVs to Parquet** — `sensor_preprocessed.csv` (246 MB) and
   `schedules_preprocessed.csv` (43.5 MB) should be converted for faster ML loading.

2. **Build the OD matrix from ticketing** — aggregate `od_pair` into a station × station
   demand matrix for crowd flow prediction.

3. **Join schedules with stations** — enrich schedule stops with geographic coordinates
   for spatial-temporal crowd models.

4. **Standardise station names across datasets** — `station_name` spelling varies across
   delay, ticketing, schedules, and stations datasets. Build a canonical station name lookup.

5. **Create a unified `crowd_features` table** — join delay + ticketing + schedules
   aggregated to station × hour × day_of_week granularity.

6. **Flag train occupancy data properly** — rename `occupancy_preprocessed.csv` to
   `metro_stations_preprocessed.csv` in Milestone 2 to avoid confusion with the GPS file.

7. **Build a data catalog** — create a `datasets/DATA_CATALOG.md` documenting each
   dataset's source, schema, row count, and join keys for team onboarding.

---

*Report generated by: Metro Platform Data Engineering Team*
*Pipeline: `datasets/scripts/preprocessing/run_all_preprocessing.py`*
*All preprocessing logs: `datasets/logs/`*

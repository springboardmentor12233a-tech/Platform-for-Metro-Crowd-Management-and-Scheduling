# MetroFlow Database Schema

## users

Stores admin and operator login details.

| Field | Purpose |
|---|---|
| id | Primary key |
| username | Login username |
| full_name | Display name |
| role | admin or operator |
| assigned_station | Station assigned to operator |
| hashed_password | Hashed password |

## stations

Stores station information.

| Field | Purpose |
|---|---|
| id | Primary key |
| name | Station name |
| line | Metro line |
| capacity | Demo operational capacity used for congestion percentage |

## passenger_flows

Stores imported Delhi Metro passenger trip data.

| Field | Purpose |
|---|---|
| id | Primary key |
| trip_id | Dataset trip ID |
| travel_date | Travel date |
| from_station_id | Source station |
| to_station_id | Destination station |
| distance_km | Trip distance |
| fare | Fare amount |
| cost_per_passenger | Cost per passenger |
| passengers | Passenger count |
| ticket_type | Ticket category |
| remarks | Peak/off-peak/context label |

## train_schedules

Stores train schedule workflow for Milestone 2.

| Field | Purpose |
|---|---|
| train_number | Train identifier |
| line | Metro line |
| source_station | Starting station |
| destination_station | Ending station |
| departure_time | Departure time |
| arrival_time | Arrival time |
| frequency_minutes | Current train frequency |
| recommended_frequency | AI recommended frequency |
| expected_load | Expected passenger load |
| delay_minutes | Current delay |
| status | On Time or Delayed |

## alerts

Stores notification workflow for Milestone 3.

| Field | Purpose |
|---|---|
| title | Alert title |
| station_name | Related station |
| severity | Low, Moderate, High, Overcrowded |
| category | crowd, delay, emergency |
| message | Alert details |
| is_active | Active or closed |
| created_at | Created timestamp |

## emergency_announcements

Stores emergency announcement records.

## operational_updates

Stores real-time schedule or crowd updates.

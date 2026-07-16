# Models

This directory contains SQLAlchemy ORM models for all database entities.

## Purpose

Define database table structures using Python classes that map to PostgreSQL tables.
Each model class inherits from `Base` (defined in `app.database.session`) and
describes columns, relationships, and constraints.

## Planned Models (Future Milestones)

| File | Entity | Description |
|------|--------|-------------|
| `user.py` | `User` | User accounts, hashed passwords, and roles (admin / operator / analyst) |
| `station.py` | `Station` | Metro station metadata — name, GPS coordinates, line associations |
| `train.py` | `Train` | Train fleet records — number, capacity, line assignment |
| `schedule.py` | `Schedule` | Train departure/arrival schedules with status tracking |
| `crowd_reading.py` | `CrowdReading` | Time-series crowd density readings per station platform |
| `alert.py` | `Alert` | System-generated alerts with severity, resolution status, and timestamps |

## Conventions

- All models use `id: Mapped[int]` as auto-increment primary key.
- Timestamps use `created_at` and `updated_at` columns with server defaults.
- Soft-deletes via `is_active: Mapped[bool]` where applicable.
- Relationships are declared using `relationship()` with `back_populates`.

## Status

> **Milestone 1** — No models are active. Directory prepared for Milestone 2+.

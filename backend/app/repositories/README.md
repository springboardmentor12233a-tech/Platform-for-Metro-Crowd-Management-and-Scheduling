# Repositories

Data Access Layer — abstracts all database interactions using the Repository Pattern.

## Purpose

Repositories provide a clean interface between the service layer and the database.
Only repositories should contain SQLAlchemy queries — services never query the DB directly.

## Planned Repositories (Future Milestones)

| File | Description |
|------|-------------|
| `user_repository.py` | CRUD operations for User model |
| `station_repository.py` | Station data queries |
| `schedule_repository.py` | Train schedule read/write operations |
| `crowd_repository.py` | Crowd reading inserts and time-series queries |
| `alert_repository.py` | Alert creation, resolution, and filtering |
| `train_repository.py` | Train position and status updates |

## Pattern

Each repository follows this interface pattern:

```python
class BaseRepository:
    def get(self, id: int) -> Model: ...
    def get_all(self) -> List[Model]: ...
    def create(self, data: Schema) -> Model: ...
    def update(self, id: int, data: Schema) -> Model: ...
    def delete(self, id: int) -> bool: ...
```

## Status

Prepared for Milestone 2+. No repository code is active in Milestone 1.

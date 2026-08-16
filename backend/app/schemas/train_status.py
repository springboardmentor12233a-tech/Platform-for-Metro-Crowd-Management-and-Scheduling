from typing import Optional

from pydantic import BaseModel


class TrainStatusResponse(BaseModel):

    train_number: str
    train_name: str

    line: str

    capacity: int

    current_station: str

    status: str

    speed_limit_kmh: Optional[int] = None

    manufacturer: Optional[str] = None

    model: Optional[str] = None

    year_of_manufacture: Optional[int] = None

    # Dashboard fields

    health_score: Optional[float] = None

    occupancy_percentage: Optional[float] = None

    recommendation: str

    last_updated: Optional[str] = None
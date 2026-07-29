"""
Schema package exports.

Each model has its own schema file.
Import schemas from here when needed.
"""

from .train import (
    TrainBase,
    TrainCreate,
    TrainUpdate,
    TrainResponse,
)

# Uncomment these after you implement them

from .station import (
    StationBase,
  StationCreate,
    StationUpdate,
    StationResponse,

)
    




from .schedule import (
    ScheduleBase,
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleResponse,
)

from .trip import (
    TripBase,
    TripCreate,
    TripUpdate,
    TripResponse,
)

from .ticket import (
    TicketBase,
    TicketCreate,
    TicketUpdate,
    TicketResponse,
)

from .delay import (
    DelayBase,
    DelayCreate,
    DelayUpdate,
    DelayResponse,
)

from .occupancy import (
    OccupancyBase,
    OccupancyCreate,
    OccupancyUpdate,
    OccupancyResponse,
)

from .sensor_telemetry import (
    SensorTelemetryBase,
    SensorTelemetryCreate,
    SensorTelemetryUpdate,
    SensorTelemetryResponse,
)

from .crowd_history import (
    CrowdHistoryBase,
    CrowdHistoryCreate,
    CrowdHistoryUpdate,
    CrowdHistoryResponse,
)

from .crowd_prediction import (
    CrowdPredictionBase,
    CrowdPredictionCreate,
    CrowdPredictionUpdate,
    CrowdPredictionResponse,
)

from .passenger_journey import (
    PassengerJourneyBase,
    PassengerJourneyCreate,
    PassengerJourneyUpdate,
    PassengerJourneyResponse,
)
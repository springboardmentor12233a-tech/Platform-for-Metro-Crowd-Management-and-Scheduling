from app.models.station import Station
from app.repositories.base import CRUDBase
from app.schemas.station import StationCreate, StationUpdate


class StationRepository(
    CRUDBase[
        Station,
        StationCreate,
        StationUpdate,
    ]
):
    pass


station_repository = StationRepository(Station)
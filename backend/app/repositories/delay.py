from app.models.delay import Delay
from app.repositories.base import CRUDBase
from app.schemas.delay import DelayCreate, DelayUpdate


class DelayRepository(
    CRUDBase[
        Delay,
        DelayCreate,
        DelayUpdate,
    ]
):
    pass


delay_repository = DelayRepository(Delay)
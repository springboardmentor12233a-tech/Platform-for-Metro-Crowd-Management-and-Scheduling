from app.models.ticket import Ticket
from app.repositories.base import CRUDBase
from app.schemas.ticket import (
    TicketCreate,
    TicketUpdate,
)


class TicketRepository(
    CRUDBase[
        Ticket,
        TicketCreate,
        TicketUpdate,
    ]
):
    pass


ticket_repository = TicketRepository(Ticket)
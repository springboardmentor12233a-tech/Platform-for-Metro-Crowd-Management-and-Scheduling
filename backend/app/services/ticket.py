from sqlalchemy.orm import Session

from app.models.ticket import Ticket
from app.repositories.ticket import ticket_repository
from app.schemas.ticket import (
    TicketCreate,
    TicketUpdate,
)


class TicketService:

    @staticmethod
    def create_ticket(
        db: Session,
        ticket: TicketCreate,
    ) -> Ticket:
        return ticket_repository.create(
            db=db,
            obj_in=ticket,
        )

    @staticmethod
    def get_ticket(
        db: Session,
        ticket_id: str,
    ):
        return ticket_repository.get(
            db=db,
            id=ticket_id,
        )

    @staticmethod
    def get_all_tickets(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):
        return ticket_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_ticket(
        db: Session,
        ticket_id: str,
        ticket: TicketUpdate,
    ):
        db_obj = ticket_repository.get(
            db=db,
            id=ticket_id,
        )

        if db_obj is None:
            return None

        return ticket_repository.update(
            db=db,
            db_obj=db_obj,
            obj_in=ticket,
        )

    @staticmethod
    def delete_ticket(
        db: Session,
        ticket_id: str,
    ):
        return ticket_repository.remove(
            db=db,
            id=ticket_id,
        )
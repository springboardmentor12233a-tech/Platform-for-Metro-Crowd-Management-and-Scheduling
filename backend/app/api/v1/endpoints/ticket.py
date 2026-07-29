from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.ticket import (
    TicketCreate,
    TicketUpdate,
    TicketResponse,
)
from app.services.ticket import TicketService

router = APIRouter()


@router.post(
    "/",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db),
):
    return TicketService.create_ticket(
        db=db,
        ticket=ticket,
    )


@router.get(
    "/",
    response_model=List[TicketResponse],
)
def get_all_tickets(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return TicketService.get_all_tickets(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{ticket_id}",
    response_model=TicketResponse,
)
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
):
    ticket = TicketService.get_ticket(
        db=db,
        ticket_id=ticket_id,
    )

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found",
        )

    return ticket


@router.put(
    "/{ticket_id}",
    response_model=TicketResponse,
)
def update_ticket(
    ticket_id: str,
    ticket: TicketUpdate,
    db: Session = Depends(get_db),
):
    updated = TicketService.update_ticket(
        db=db,
        ticket_id=ticket_id,
        ticket=ticket,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found",
        )

    return updated


@router.delete(
    "/{ticket_id}",
    response_model=TicketResponse,
)
def delete_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
):
    deleted = TicketService.delete_ticket(
        db=db,
        ticket_id=ticket_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found",
        )

    return deleted
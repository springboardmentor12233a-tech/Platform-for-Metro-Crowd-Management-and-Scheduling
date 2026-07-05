from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.passenger_flow import PassengerFlow
from app.schemas.passenger_flow import PassengerFlowCreate
from app.services.passenger_flow_service import (
    create_passenger_flow,
    get_all_passenger_flow,
    get_passenger_flow,
    update_passenger_flow,
    delete_passenger_flow,
)

router = APIRouter(
    prefix="/passenger-flow",
    tags=["Passenger Flow"],
)


@router.post("/")
def add_flow(request: PassengerFlowCreate, db: Session = Depends(get_db)):
    flow = PassengerFlow(**request.model_dump())
    return create_passenger_flow(db, flow)


@router.get("/")
def all_flow(db: Session = Depends(get_db)):
    return get_all_passenger_flow(db)


@router.get("/{flow_id}")
def flow_by_id(flow_id: int, db: Session = Depends(get_db)):
    flow = get_passenger_flow(db, flow_id)

    if not flow:
        raise HTTPException(status_code=404, detail="Record not found")

    return flow


@router.put("/{flow_id}")
def edit_flow(
    flow_id: int,
    request: PassengerFlowCreate,
    db: Session = Depends(get_db),
):
    flow = update_passenger_flow(db, flow_id, request)

    if not flow:
        raise HTTPException(status_code=404, detail="Record not found")

    return flow


@router.delete("/{flow_id}")
def remove_flow(flow_id: int, db: Session = Depends(get_db)):
    flow = delete_passenger_flow(db, flow_id)

    if not flow:
        raise HTTPException(status_code=404, detail="Record not found")

    return {
        "message": "Passenger flow deleted successfully"
    }
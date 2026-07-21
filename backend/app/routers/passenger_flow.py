from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.passenger_flow import PassengerFlow
from app.schemas.passenger_flow import PassengerFlowCreate
from app.auth.dependencies import require_roles

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


# ------------------------------------
# Create Passenger Flow
# Admin | Operator
# ------------------------------------
@router.post("/")
def add_flow(
    request: PassengerFlowCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
        )
    ),
):
    flow = PassengerFlow(**request.model_dump())
    return create_passenger_flow(db, flow)


# ------------------------------------
# Get All Passenger Flow
# Admin | Operator | Analyst
# ------------------------------------
@router.get("/")
def all_flow(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
        )
    ),
):
    return get_all_passenger_flow(db)


# ------------------------------------
# Get Passenger Flow By ID
# Admin | Operator | Analyst
# ------------------------------------
@router.get("/{flow_id}")
def flow_by_id(
    flow_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
        )
    ),
):
    flow = get_passenger_flow(db, flow_id)

    if not flow:
        raise HTTPException(
            status_code=404,
            detail="Record not found",
        )

    return flow


# ------------------------------------
# Update Passenger Flow
# Admin | Operator
# ------------------------------------
@router.put("/{flow_id}")
def edit_flow(
    flow_id: int,
    request: PassengerFlowCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
        )
    ),
):
    flow = update_passenger_flow(
        db,
        flow_id,
        request,
    )

    if not flow:
        raise HTTPException(
            status_code=404,
            detail="Record not found",
        )

    return flow


# ------------------------------------
# Delete Passenger Flow
# Admin Only
# ------------------------------------
@router.delete("/{flow_id}")
def remove_flow(
    flow_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
        )
    ),
):
    flow = delete_passenger_flow(
        db,
        flow_id,
    )

    if not flow:
        raise HTTPException(
            status_code=404,
            detail="Record not found",
        )

    return {
        "message": "Passenger flow deleted successfully"
    }
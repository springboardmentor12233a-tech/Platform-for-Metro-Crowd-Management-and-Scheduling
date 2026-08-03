from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.passenger_flow import PassengerFlow
from app.schemas.passenger_flow import PassengerFlowCreate
from app.auth.permissions import require_roles
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
# Read access: Admin | Operator | Analyst
# ------------------------------------
read_router = APIRouter(
    dependencies=[
        Depends(
            require_roles(
                "Admin",
                "Operator",
                "Analyst",
            )
        )
    ],
)

# ------------------------------------
# Create/Update access: Admin | Operator
# ------------------------------------
write_router = APIRouter(
    dependencies=[
        Depends(
            require_roles(
                "Admin",
                "Operator",
            )
        )
    ],
)

# ------------------------------------
# Delete access: Admin only
# ------------------------------------
delete_router = APIRouter(
    dependencies=[
        Depends(require_roles("Admin")),
    ],
)


# ------------------------------------
# Get All Passenger Flow
# ------------------------------------
@read_router.get("/")
def all_flow(
    db: Session = Depends(get_db),
):
    return get_all_passenger_flow(db)


# ------------------------------------
# Get Passenger Flow By ID
# ------------------------------------
@read_router.get("/{flow_id}")
def flow_by_id(
    flow_id: int,
    db: Session = Depends(get_db),
):
    flow = get_passenger_flow(db, flow_id)

    if not flow:
        raise HTTPException(
            status_code=404,
            detail="Record not found",
        )

    return flow


# ------------------------------------
# Create Passenger Flow
# ------------------------------------
@write_router.post("/")
def add_flow(
    request: PassengerFlowCreate,
    db: Session = Depends(get_db),
):
    flow = PassengerFlow(**request.model_dump())
    return create_passenger_flow(db, flow)


# ------------------------------------
# Update Passenger Flow
# ------------------------------------
@write_router.put("/{flow_id}")
def edit_flow(
    flow_id: int,
    request: PassengerFlowCreate,
    db: Session = Depends(get_db),
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
# ------------------------------------
@delete_router.delete("/{flow_id}")
def remove_flow(
    flow_id: int,
    db: Session = Depends(get_db),
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


router.include_router(read_router)
router.include_router(write_router)
router.include_router(delete_router)
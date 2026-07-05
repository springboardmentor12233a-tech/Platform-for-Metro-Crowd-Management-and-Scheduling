from sqlalchemy.orm import Session

from app.models.passenger_flow import PassengerFlow


def create_passenger_flow(db: Session, flow: PassengerFlow):
    db.add(flow)
    db.commit()
    db.refresh(flow)
    return flow


def get_all_passenger_flow(db: Session):
    return db.query(PassengerFlow).all()


def get_passenger_flow(db: Session, flow_id: int):
    return (
        db.query(PassengerFlow)
        .filter(PassengerFlow.id == flow_id)
        .first()
    )


def update_passenger_flow(db: Session, flow_id: int, request):
    flow = get_passenger_flow(db, flow_id)

    if not flow:
        return None

    flow.station_id = request.station_id
    flow.flow_date = request.flow_date
    flow.flow_time = request.flow_time
    flow.passengers_in = request.passengers_in
    flow.passengers_out = request.passengers_out
    flow.occupancy = request.occupancy

    db.commit()
    db.refresh(flow)

    return flow


def delete_passenger_flow(db: Session, flow_id: int):
    flow = get_passenger_flow(db, flow_id)

    if not flow:
        return None

    db.delete(flow)
    db.commit()

    return flow
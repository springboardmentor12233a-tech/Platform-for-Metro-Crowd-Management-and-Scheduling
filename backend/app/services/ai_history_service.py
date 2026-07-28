from sqlalchemy.orm import Session

from app.models.ai_recommendation import AIRecommendation


def save_recommendation(
    db: Session,
    station_name: str,
    risk_level: str,
    summary: str,
    recommendation: str,
    operational_action: str,
    expected_impact: str,
    confidence: int = 95,
):
    recommendation_record = AIRecommendation(
        station_name=station_name,
        risk_level=risk_level,
        summary=summary,
        recommendation=recommendation,
        operational_action=operational_action,
        expected_impact=expected_impact,
        confidence=confidence,
    )

    db.add(recommendation_record)
    db.commit()
    db.refresh(recommendation_record)

    return recommendation_record


def get_history(
    db: Session,
    limit: int = 20,
):
    return (
        db.query(AIRecommendation)
        .order_by(AIRecommendation.created_at.desc())
        .limit(limit)
        .all()
    )
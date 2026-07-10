from fastapi import APIRouter

router = APIRouter()

# Sample crowd monitoring data
crowd_data = [
    {
        "station": "Central Station",
        "passengers": 250,
        "crowd_level": "Medium"
    },
    {
        "station": "North Station",
        "passengers": 420,
        "crowd_level": "High"
    },
    {
        "station": "South Station",
        "passengers": 120,
        "crowd_level": "Low"
    }
]

@router.get("/crowd")
def get_crowd_data():
    return {
        "message": "Crowd data retrieved successfully",
        "data": crowd_data
    }

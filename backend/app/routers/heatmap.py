from fastapi import APIRouter

router = APIRouter(
    prefix="/heatmap",
    tags=["Congestion Heatmap"]
)

@router.get("/stations")
def get_station_heatmap():

    stations = [

        {
            "station": "Ameerpet",
            "passengers": 1850,
            "capacity": 1200,
            "crowd_level": "High"
        },

        {
            "station": "Miyapur",
            "passengers": 650,
            "capacity": 1200,
            "crowd_level": "Low"
        },

        {
            "station": "Raidurg",
            "passengers": 1450,
            "capacity": 1200,
            "crowd_level": "High"
        },

        {
            "station": "LB Nagar",
            "passengers": 800,
            "capacity": 1200,
            "crowd_level": "Medium"
        },

        {
            "station": "Nagole",
            "passengers": 2200,
            "capacity": 1200,
            "crowd_level": "Critical"
        },

        {
            "station": "Secunderabad",
            "passengers": 1100,
            "capacity": 1200,
            "crowd_level": "Medium"
        }

    ]

    return stations
def recommend_frequency(demand_level: str):

    demand_level = demand_level.strip().lower()

    if demand_level == "high":
        return {
            "recommended_frequency": "Every 3 Minutes",
            "additional_trains": 2,
            "status": "Peak Hour"
        }

    elif demand_level == "medium":
        return {
            "recommended_frequency": "Every 5 Minutes",
            "additional_trains": 1,
            "status": "Normal"
        }

    elif demand_level == "low":
        return {
            "recommended_frequency": "Every 8 Minutes",
            "additional_trains": 0,
            "status": "Low Traffic"
        }

    else:
        return {
            "error": "Invalid demand level"
        }
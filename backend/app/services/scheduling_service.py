def generate_schedule(predicted_passengers: float):
    """
    Generate smart scheduling recommendations
    based on predicted passenger count.
    """

    if predicted_passengers < 10:
        return {
            "crowd_level": "Low",
            "train_frequency": "Every 10 Minutes",
            "extra_trains": 0,
            "platform_staff": 4,
            "status": "Normal Operations",
            "recommendation": "Current schedule is sufficient."
        }

    elif predicted_passengers < 20:
        return {
            "crowd_level": "Medium",
            "train_frequency": "Every 7 Minutes",
            "extra_trains": 1,
            "platform_staff": 6,
            "status": "Monitor Crowd",
            "recommendation": "Deploy one additional train."
        }

    elif predicted_passengers < 35:
        return {
            "crowd_level": "High",
            "train_frequency": "Every 5 Minutes",
            "extra_trains": 2,
            "platform_staff": 8,
            "status": "Heavy Crowd",
            "recommendation": "Increase train frequency."
        }

    else:
        return {
            "crowd_level": "Critical",
            "train_frequency": "Every 3 Minutes",
            "extra_trains": 4,
            "platform_staff": 12,
            "status": "Emergency",
            "recommendation": "Deploy maximum trains and crowd control staff."
        }
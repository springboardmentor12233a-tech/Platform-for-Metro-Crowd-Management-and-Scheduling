from math import ceil
from datetime import datetime, timedelta


class TrainScheduler:
    """
    AI-assisted train scheduling helper.
    """

    @staticmethod
    def optimize_frequency(predicted_passengers: int,
                           current_frequency: int):
        """
        Suggest a new train frequency based on passenger demand.
        """

        if predicted_passengers <= 1000:
            recommended = current_frequency

        elif predicted_passengers <= 3000:
            recommended = max(current_frequency + 2,
                              current_frequency)

        elif predicted_passengers <= 5000:
            recommended = current_frequency + 4

        else:
            recommended = current_frequency + 6

        wait_time = round(60 / recommended, 2)

        return {
            "recommended_frequency": recommended,
            "expected_wait_time": wait_time,
            "recommendation":
                f"Increase service to {recommended} trains/hour"
        }

    @staticmethod
    def estimate_platform_load(passengers: int):
        """
        Estimate crowd level at the platform.
        """

        if passengers < 1000:
            return "Low"

        elif passengers < 3000:
            return "Moderate"

        elif passengers < 5000:
            return "High"

        return "Critical"

    @staticmethod
    def estimate_required_trains(predicted_passengers: int,
                                 train_capacity: int = 1000):
        """
        Estimate how many trains are needed.
        """

        return ceil(predicted_passengers / train_capacity)
    @staticmethod
    def peak_hour_optimization(hour: int, predicted_passengers: int):
        """
        Optimize frequency based on peak hours.
        """

        peak_hours = [8, 9, 10, 17, 18, 19]

        if hour in peak_hours:
            multiplier = 1.30
            priority = "HIGH"
        else:
            multiplier = 1.00
            priority = "NORMAL"

        optimized_passengers = int(predicted_passengers * multiplier)

        return {
            "hour": hour,
            "priority": priority,
            "optimized_passengers": optimized_passengers
        }
    @staticmethod
    def generate_schedule(
        start_hour: int,
        end_hour: int,
        frequency_per_hour: int
    ):
        """
        Generate train timings.
        """

        schedule = []

        interval = int(60 / frequency_per_hour)

        for hour in range(start_hour, end_hour + 1):

            minute = 0

            while minute < 60:

                schedule.append(
                    f"{hour:02d}:{minute:02d}"
                )

                minute += interval

        return schedule 

    @staticmethod
    def handle_delay(schedule: list[str], delay_minutes: int):
        """
        Apply delay to every departure in the schedule.
        """
    
        if delay_minutes <= 5:
            severity = "LOW"
            recommendation = "Monitor the train."
    
        elif delay_minutes <= 15:
            severity = "MEDIUM"
            recommendation = "Increase train frequency."
    
        else:
            severity = "HIGH"
            recommendation = (
                "Dispatch additional train and notify passengers."
            )
    
        updated_schedule = []
    
        for departure in schedule:
    
            old_time = datetime.strptime(departure, "%H:%M")
    
            new_time = old_time + timedelta(
                minutes=delay_minutes
            )
    
            updated_schedule.append({
                "old_departure": departure,
                "new_departure": new_time.strftime("%H:%M")
            })
    
        return {
            "delay_minutes": delay_minutes,
            "severity": severity,
            "recommendation": recommendation,
            "updated_schedule": updated_schedule
        }
    @staticmethod
    def allocate_platform(passengers: int):

        if passengers < 2000:
            return {
                "platform": 1,
                "priority": "Normal"
            }

        elif passengers < 5000:
            return {
                "platform": 2,
                "priority": "High"
            }

        return {
            "platform": 3,
            "priority": "Emergency"
        }  
    @staticmethod
    def schedule_alert(train_id: int, message: str):

        return {
            "train_id": train_id,
            "message": message,
            "status": "Alert Sent"
        }     
    @staticmethod
    def frequency_adjustment(current_frequency: int,
                         recommended_frequency: int):
        """
        Suggest how many trains should be added or removed.
        """

        difference = recommended_frequency - current_frequency

        if difference > 0:
            action = "Increase"
        elif difference < 0:
            action = "Decrease"
        else:
            action = "Maintain"

        return {
            "current_frequency": current_frequency,
            "recommended_frequency": recommended_frequency,
            "adjustment": difference,
            "action": action
    }    
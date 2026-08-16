# Any required enums
from enum import Enum


class TrainStatus(str, Enum):
    ACTIVE = "Active"
    MAINTENANCE = "Maintenance"
    DELAYED = "Delayed"
    OUT_OF_SERVICE = "Out of Service"


class DayType(str, Enum):
    WEEKDAY = "Weekday"
    WEEKEND = "Weekend"
    HOLIDAY = "Holiday" 


class CrowdLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    VERY_HIGH = "Very High"


class TicketType(str, Enum):
    SINGLE = "Single"
    RETURN = "Return"
    SMART_CARD = "Smart Card"
    TOKEN = "Token"
    PASS = "Pass"
    TOURIST_CARD = "Tourist Card"


class DeviceStatus(str, Enum):
    WORKING = "Working"
    FAULTY = "Faulty"
    MAINTENANCE = "Maintenance"
    OFFLINE = "Offline"


class Season(str, Enum):
    SPRING = "Spring"
    SUMMER = "Summer"
    MONSOON = "Monsoon"
    AUTUMN = "Autumn"
    WINTER = "Winter"


class WeatherCondition(str, Enum):
    SUNNY = "Sunny"
    CLOUDY = "Cloudy"
    RAINY = "Rainy"
    STORM = "Storm"
    FOG = "Fog"
    SNOW = "Snow"

class TransportType(str, Enum):
    METRO = "Metro"
    BUS = "Bus"
    TRAIN = "Train"
    TRAM = "Tram"


class Weekday(str, Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"
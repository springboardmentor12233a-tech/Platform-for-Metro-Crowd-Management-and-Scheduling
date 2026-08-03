from pydantic import BaseModel


class SummaryResponse(BaseModel):
    total: int
    success: int
    failed: int
    active_users: int


class LoginTrend(BaseModel):
    date: str
    count: int


class ModuleDistribution(BaseModel):
    module: str
    count: int


class SuccessRate(BaseModel):
    name: str
    value: int


class TopUser(BaseModel):
    user: str
    count: int


class HourlyActivity(BaseModel):
    hour: str
    count: int


class AnalyticsResponse(BaseModel):
    summary: SummaryResponse
    loginTrend: list[LoginTrend]
    moduleDistribution: list[ModuleDistribution]
    successRate: list[SuccessRate]
    topUsers: list[TopUser]
    hourlyActivity: list[HourlyActivity]
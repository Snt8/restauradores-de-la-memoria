from typing import Literal, Self

from pydantic import BaseModel

from app.domain.health import ComponentStatus, ReadinessReport


class LivenessResponse(BaseModel):
    status: Literal["ok"]


class ReadinessResponse(BaseModel):
    status: Literal["ok", "unavailable"]
    database: ComponentStatus

    @classmethod
    def from_report(cls, report: ReadinessReport) -> Self:
        return cls(status="ok" if report.is_ready else "unavailable", database=report.database)

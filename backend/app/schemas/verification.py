from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VerificationOut(BaseModel):
    id: int
    land_id: int
    verifier_id: Optional[int] = None
    status: str
    notes: Optional[str] = None
    verified_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

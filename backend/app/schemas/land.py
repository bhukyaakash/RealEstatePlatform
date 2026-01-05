from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentOut(BaseModel):
    id: int
    document_type: str
    document_url: str
    file_name: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class LandCreate(BaseModel):
    title: str
    description: Optional[str] = None
    area_sqft: float
    price: float
    address: str
    city: str
    state: str
    pincode: str

class LandUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    area_sqft: Optional[float] = None
    price: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    is_available: Optional[bool] = None

class LandOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    area_sqft: float
    price: float
    address: str
    city: str
    state: str
    pincode: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_verified: bool
    is_available: bool
    owner_id: int
    created_at: datetime
    documents: List[DocumentOut] = []

    class Config:
        from_attributes = True

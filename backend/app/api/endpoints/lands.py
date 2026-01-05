from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.base import get_db
from app.models.user import User
from app.models.land import Land
from app.models.document import Document
from app.models.verification import Verification
from app.schemas.land import LandCreate, LandUpdate, LandOut
from app.api.deps.auth import get_current_user
from app.services.geolocation import geocode_address, calculate_distance_km
from app.services.cloud_storage import upload_document

router = APIRouter()

@router.post("/", response_model=LandOut, status_code=201)
async def create_land(payload: LandCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    coords = await geocode_address(payload.address, payload.city, payload.state)
    land = Land(
        title=payload.title,
        description=payload.description,
        area_sqft=payload.area_sqft,
        price=payload.price,
        address=payload.address,
        city=payload.city,
        state=payload.state,
        pincode=payload.pincode,
        latitude=coords[0] if coords else None,
        longitude=coords[1] if coords else None,
        owner_id=user.id,
        is_verified=False,
        is_available=True,
    )
    db.add(land)
    db.commit()
    db.refresh(land)

    db.add(Verification(land_id=land.id, status="pending", created_at=datetime.utcnow()))
    db.commit()

    return land

@router.get("/my-lands", response_model=List[LandOut])
async def my_lands(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Land).filter(Land.owner_id == user.id).order_by(Land.created_at.desc()).all()

@router.get("/", response_model=List[LandOut])
async def list_lands(
    city: Optional[str] = None,
    state: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_area: Optional[float] = None,
    max_area: Optional[float] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: float = 25.0,
    db: Session = Depends(get_db),
):
    q = db.query(Land).filter(Land.is_available == True)
    q = q.filter(Land.is_verified == True)

    if city:
        q = q.filter(Land.city.ilike(f"%{city}%"))
    if state:
        q = q.filter(Land.state.ilike(f"%{state}%"))
    if min_price is not None:
        q = q.filter(Land.price >= min_price)
    if max_price is not None:
        q = q.filter(Land.price <= max_price)
    if min_area is not None:
        q = q.filter(Land.area_sqft >= min_area)
    if max_area is not None:
        q = q.filter(Land.area_sqft <= max_area)

    lands = q.order_by(Land.created_at.desc()).all()

    # optional radius filtering
    if latitude is not None and longitude is not None:
        filtered = []
        for land in lands:
            if land.latitude is None or land.longitude is None:
                continue
            d = calculate_distance_km(latitude, longitude, land.latitude, land.longitude)
            if d <= radius_km:
                filtered.append(land)
        return filtered

    return lands

@router.get("/{land_id}", response_model=LandOut)
async def get_land(land_id: int, db: Session = Depends(get_db)):
    land = db.query(Land).filter(Land.id == land_id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land not found")
    return land

@router.put("/{land_id}", response_model=LandOut)
async def update_land(land_id: int, payload: LandUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    land = db.query(Land).filter(Land.id == land_id, Land.owner_id == user.id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(land, k, v)
    # if address changed, optionally re-geocode
    db.commit()
    db.refresh(land)
    return land

@router.delete("/{land_id}")
async def delete_land(land_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    land = db.query(Land).filter(Land.id == land_id, Land.owner_id == user.id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land not found")
    db.delete(land)
    db.commit()
    return {"message": "Deleted"}

@router.post("/{land_id}/documents")
async def add_document(
    land_id: int,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    land = db.query(Land).filter(Land.id == land_id, Land.owner_id == user.id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land not found")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    url = await upload_document(content, file.filename, folder=f"lands/{land_id}")
    if not url:
        raise HTTPException(status_code=500, detail="Upload failed")

    doc = Document(land_id=land_id, document_type=document_type, document_url=url, file_name=file.filename)
    db.add(doc)
    db.commit()

    return {"message": "Uploaded", "url": url}

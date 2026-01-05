from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.base import get_db
from app.models.user import User
from app.models.land import Land
from app.schemas.user import UserOut, UserCreate
from app.schemas.land import LandOut
from app.api.deps.auth import require_admin
from app.core.security import get_password_hash

router = APIRouter()

@router.get("/users", response_model=List[UserOut])
async def users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.post("/users", response_model=UserOut, status_code=201)
async def create_user(payload: UserCreate, role: str = "user", admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    if role not in ["user", "verifier", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        role=role,
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/users/{user_id}/role")
async def set_role(user_id: int, role: str, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    if role not in ["user", "verifier", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    u.role = role
    db.commit()
    return {"message": "Role updated"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    if u.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin")
    db.delete(u)
    db.commit()
    return {"message": "Deleted"}

@router.get("/lands", response_model=List[LandOut])
async def lands(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Land).order_by(Land.created_at.desc()).all()

@router.delete("/lands/{land_id}")
async def delete_land(land_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    land = db.query(Land).filter(Land.id == land_id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land not found")
    db.delete(land)
    db.commit()
    return {"message": "Deleted"}

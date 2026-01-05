from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.base import get_db
from app.models.user import User
from app.models.verification import Verification
from app.models.land import Land
from app.schemas.verification import VerificationOut
from app.api.deps.auth import require_verifier

router = APIRouter()

@router.get("/pending", response_model=List[VerificationOut])
async def pending(verifier: User = Depends(require_verifier), db: Session = Depends(get_db)):
    return db.query(Verification).filter(Verification.status == "pending").order_by(Verification.created_at.asc()).all()

@router.put("/{verification_id}/approve")
async def approve(verification_id: int, notes: Optional[str] = None, verifier: User = Depends(require_verifier), db: Session = Depends(get_db)):
    v = db.query(Verification).filter(Verification.id == verification_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Verification not found")

    v.status = "approved"
    v.notes = notes
    v.verifier_id = verifier.id
    v.verified_at = datetime.utcnow()

    land = db.query(Land).filter(Land.id == v.land_id).first()
    if land:
        land.is_verified = True

    db.commit()
    return {"message": "Approved"}

@router.put("/{verification_id}/reject")
async def reject(verification_id: int, notes: str, verifier: User = Depends(require_verifier), db: Session = Depends(get_db)):
    v = db.query(Verification).filter(Verification.id == verification_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Verification not found")

    v.status = "rejected"
    v.notes = notes
    v.verifier_id = verifier.id
    v.verified_at = datetime.utcnow()

    db.commit()
    return {"message": "Rejected"}

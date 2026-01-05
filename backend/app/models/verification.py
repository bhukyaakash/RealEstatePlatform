from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    land_id = Column(Integer, ForeignKey("lands.id"), nullable=False)
    verifier_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    status = Column(String, default="pending")  # pending | approved | rejected
    notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    land = relationship("Land", back_populates="verifications")
    verifier = relationship("User")

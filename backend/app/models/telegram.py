from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .models_base import BaseModel

class TelegramSession(BaseModel):
    __tablename__ = "telegram_sessions"
    user_id = Column(Integer, ForeignKey("users.id"))
    session_file = Column(String, unique=True)
    phone_number = Column(String)
    last_used = Column(DateTime, default=datetime.now)
    
    user = relationship("User", back_populates="telegram_sessions")
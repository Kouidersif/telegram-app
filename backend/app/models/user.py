from sqlalchemy import Column, String
from .models_base import BaseModel
from sqlalchemy.orm import relationship



class User(BaseModel):
    __tablename__ = "users"
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    telegram_sessions = relationship("TelegramSession", back_populates="user")
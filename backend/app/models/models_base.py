from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean


Base = declarative_base()



class BaseModel(Base):
    __abstract__ = True
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(String, index=True)
    updated_at = Column(String, index=True)
    is_active = Column(Boolean, default=True)
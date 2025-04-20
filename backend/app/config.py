import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Telegram API"
    PROJECT_VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./telegram_viewer.db")
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Telegram API
    TELEGRAM_API_ID: int = int(os.getenv("TELEGRAM_API_ID", "0"))
    TELEGRAM_API_HASH: str = os.getenv("TELEGRAM_API_HASH", "")
    
    # Session storage
    SESSION_DIR: str = os.getenv("SESSION_DIR", "./sessions")

settings = Settings()
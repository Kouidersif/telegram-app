
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Optional

from ..dependencies import get_db
from ..services.auth_service import get_current_user
from ..services.telegram_service import TelegramService
from ..models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/telegram", tags=["telegram"])

class TelegramConnect(BaseModel):
    phone_number: str

class TelegramVerify(BaseModel):
    session_id: int
    code: str
    phone_code_hash: Optional[str] = None

class ChatModel(BaseModel):
    id: int
    title: str
    type: str
    unread_count: int
    

class MessageSender(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None

class MessageModel(BaseModel):
    id: int
    date: str
    text: Optional[str] = ""
    sender_id: Optional[int] = None
    sender_name: Optional[str] = None
    is_outgoing: bool

class SessionModel(BaseModel):
    id: int
    phone_number: str
    last_used: str

@router.post("/connect", response_model=Dict)
async def connect_telegram(
    telegram_data: TelegramConnect,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    telegram_service = TelegramService(db)
    result = await telegram_service.start_telegram_connection(
        current_user.id, 
        telegram_data.phone_number
    )
    return result

@router.post("/verify", response_model=Dict)
async def verify_telegram_code(
    verify_data: TelegramVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    telegram_service = TelegramService(db)
    success = await telegram_service.complete_telegram_auth(
        verify_data.session_id,
        verify_data.code,
        verify_data.phone_code_hash
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to verify Telegram code"
        )
    
    return {"success": True, "message": "Telegram account connected successfully"}

@router.get("/sessions", response_model=List[SessionModel])
async def get_telegram_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    telegram_service = TelegramService(db)
    sessions = telegram_service.get_active_sessions(current_user.id)
    
    return [
        {
            "id": session.id,
            "phone_number": session.phone_number,
            "last_used": session.last_used.isoformat()
        }
        for session in sessions
    ]

@router.get("/chats/{session_id}", response_model=List[ChatModel])
async def get_telegram_chats(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    telegram_service = TelegramService(db)
    chats = await telegram_service.get_chats(session_id)
    return chats

@router.get("/messages/{session_id}/{chat_id}", response_model=List[MessageModel])
async def get_telegram_messages(
    session_id: int,
    chat_id: int,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    telegram_service = TelegramService(db)
    messages = await telegram_service.get_messages(session_id, chat_id, limit)
    return messages

@router.post("/logout/{session_id}")
async def logout_from_telegram(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    telegram_service = TelegramService(db)
    success = await telegram_service.logout_from_telegram(session_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to logout from Telegram"
        )
    
    return {"success": True, "message": "Successfully logged out from Telegram"}
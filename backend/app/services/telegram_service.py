import os
from typing import List, Dict
import uuid
from datetime import datetime

from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetDialogsRequest
from telethon.tl.types import InputPeerEmpty, User as TelegramUser, Chat, Channel

from sqlalchemy.orm import Session
from ..models.telegram import TelegramSession
from ..models.user import User
from ..config import settings

class TelegramService:
    def __init__(self, db: Session):
        self.db = db
        os.makedirs(settings.SESSION_DIR, exist_ok=True)

    async def start_telegram_connection(self, user_id: int, phone_number: str) -> Dict:
        """Start Telegram connection process and return details needed for code verification"""
        # Create a unique session file
        session_file = f"{settings.SESSION_DIR}/{user_id}_{uuid.uuid4()}.session"
        
        # Create Telegram client
        client = TelegramClient(
            session_file,
            settings.TELEGRAM_API_ID,
            settings.TELEGRAM_API_HASH
        )
        
        await client.connect()
        
        # Start the authorization process
        if not await client.is_user_authorized():
            phone_code_hash = await client.send_code_request(phone_number)
            
            # Save the session information to DB
            db_session = TelegramSession(
                user_id=user_id,
                session_file=session_file,
                phone_number=phone_number,
                is_active=False  # Not fully authorized yet
            )
            self.db.add(db_session)
            self.db.commit()
            
            return {
                "session_id": db_session.id,
                "phone_code_hash": phone_code_hash.phone_code_hash,
                "code_required": True
            }
        else:
            # User is already authorized
            db_session = TelegramSession(
                user_id=user_id,
                session_file=session_file,
                phone_number=phone_number,
                is_active=True
            )
            self.db.add(db_session)
            self.db.commit()
            
            await client.disconnect()
            return {
                "session_id": db_session.id,
                "code_required": False
            }

    async def complete_telegram_auth(self, session_id: int, code: str, phone_code_hash: str = None) -> bool:
        """Complete authentication with received code"""
        session = self.db.query(TelegramSession).filter(TelegramSession.id == session_id).first()
        if not session:
            return False
            
        client = TelegramClient(
            session.session_file,
            settings.TELEGRAM_API_ID,
            settings.TELEGRAM_API_HASH
        )
        
        await client.connect()
        
        try:
            # Sign in with code
            await client.sign_in(session.phone_number, code, phone_code_hash=phone_code_hash)
            
            # Update session as active
            session.is_active = True
            session.last_used = datetime.utcnow()
            self.db.commit()
            
            success = True
        except Exception as e:
            print(f"Error during authentication: {e}")
            success = False
        finally:
            await client.disconnect()
            
        return success

    async def get_chats(self, session_id: int) -> List[Dict]:
        """Get all chats/dialogs from the connected Telegram account"""
        session = self.db.query(TelegramSession).filter(
            TelegramSession.id == session_id,
            TelegramSession.is_active
        ).first()
        
        if not session:
            return []
            
        client = TelegramClient(
            session.session_file,
            settings.TELEGRAM_API_ID,
            settings.TELEGRAM_API_HASH
        )
        
        await client.connect()
        
        if not await client.is_user_authorized():
            await client.disconnect()
            return []
        
        # Update last used timestamp
        session.last_used = datetime.now()
        self.db.commit()
        
        try:
            # Get dialogs
            result = await client(GetDialogsRequest(
                offset_date=None,
                offset_id=0,
                offset_peer=InputPeerEmpty(),
                limit=100,
                hash=0
            ))
            
            chats = []
            for dialog in result.dialogs:
                entity = await client.get_entity(dialog.peer)
                
                chat_info = {
                    "id": entity.id,
                    "title": "",
                    "type": "",
                    "unread_count": dialog.unread_count,
                }
                
                
                if isinstance(entity, TelegramUser):
                    chat_info["title"] = f"{entity.first_name or ''} {entity.last_name or ''}".strip()
                    chat_info["type"] = "user"
                elif isinstance(entity, Chat):
                    chat_info["title"] = entity.title
                    chat_info["type"] = "group"
                elif isinstance(entity, Channel):
                    chat_info["title"] = entity.title
                    chat_info["type"] = "channel" if entity.broadcast else "supergroup"
                
                chats.append(chat_info)
                
            return chats
        finally:
            await client.disconnect()

    async def get_messages(self, session_id: int, chat_id: int, limit: int = 50) -> List[Dict]:
        """Get messages from a specific chat"""
        session = self.db.query(TelegramSession).filter(
            TelegramSession.id == session_id,
            TelegramSession.is_active
        ).first()
        
        if not session:
            return []
            
        client = TelegramClient(
            session.session_file,
            settings.TELEGRAM_API_ID,
            settings.TELEGRAM_API_HASH
        )
        
        await client.connect()
        
        if not await client.is_user_authorized():
            await client.disconnect()
            return []
        
        # Update last used timestamp
        session.last_used = datetime.utcnow()
        self.db.commit()
        
        try:
            entity = await client.get_entity(chat_id)
            messages = []
            
            async for message in client.iter_messages(entity, limit=limit):
                message_info = {
                    "id": message.id,
                    "date": message.date.isoformat(),
                    "text": message.text,
                    "sender_id": None,
                    "sender_name": None,
                    "is_outgoing": message.out
                }
                
                if message.sender_id:
                    message_info["sender_id"] = message.sender_id
                    try:
                        sender = await client.get_entity(message.sender_id)
                        if hasattr(sender, 'first_name'):
                            message_info["sender_name"] = f"{sender.first_name or ''} {sender.last_name or ''}".strip()
                        elif hasattr(sender, 'title'):
                            message_info["sender_name"] = sender.title
                    except:
                        pass
                        
                messages.append(message_info)
                
            return messages
        finally:
            await client.disconnect()

    async def logout_from_telegram(self, session_id: int) -> bool:
        """Log out from Telegram session"""
        session = self.db.query(TelegramSession).filter(
            TelegramSession.id == session_id,
            TelegramSession.is_active
        ).first()
        
        if not session:
            return False
            
        client = TelegramClient(
            session.session_file,
            settings.TELEGRAM_API_ID,
            settings.TELEGRAM_API_HASH
        )
        
        try:
            await client.connect()
            await client.log_out()
            
            # Update session status
            session.is_active = False
            self.db.commit()
            
            # Delete the session file
            if os.path.exists(session.session_file):
                os.remove(session.session_file)
                
            return True
        except Exception as e:
            print(f"Error during logout: {e}")
            return False
        finally:
            if client.is_connected():
                await client.disconnect()

    def get_active_sessions(self, user_id: int) -> List[TelegramSession]:
        """Get all active Telegram sessions for a user"""
        return self.db.query(TelegramSession).filter(
            TelegramSession.user_id == user_id,
            TelegramSession.is_active
        ).all()
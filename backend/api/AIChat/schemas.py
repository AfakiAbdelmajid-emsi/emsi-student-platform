from typing import Optional
from pydantic import BaseModel

class ConversationCreate(BaseModel):
    title: str
    user_id: str
class MessageCreate(BaseModel):
    conversation_id: str
    role: str
    content: str

class ChatMessage(BaseModel):
    role: str
    content: str

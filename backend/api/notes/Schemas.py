from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
import json

class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    content: Dict[str, Any] = Field(default={"type": "doc", "content": []})  # Default TipTap structure
    course_id: Optional[str] = None

    @validator('content', pre=True)
    def validate_content(cls, v):
        if v is None:
            return {"type": "doc", "content": []}
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return {"type": "doc", "content": []}
        return v

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[dict] = None
    course_id: Optional[str] = None

    class Config:
        json_encoders = {
            dict: lambda v: v  # Ensure proper JSON serialization
        }

class NoteOut(NoteBase):
    id: str
    user_id: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
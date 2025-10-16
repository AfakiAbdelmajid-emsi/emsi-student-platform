from pydantic import BaseModel
from typing import Optional

class CourseCreate(BaseModel):
    title: str
    description: str = ""
    category: Optional[str] = None  # Changed from Enum to simple string

class CourseOut(BaseModel):
    id: str
    title: str
    description: str
    category: Optional[str] = None
    created_at: str
    user_id: str


class CourseUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    category: Optional[str]

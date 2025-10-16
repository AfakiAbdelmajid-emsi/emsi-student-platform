# In your schemas.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "General"
    due_date: Optional[str] = None  # Changed from date to str
    completed: bool = False

    class Config:
        json_encoders = {
            date: lambda v: v.isoformat() if v else None
        }

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str = Field(..., alias="task_id")

    class Config:
        orm_mode = True
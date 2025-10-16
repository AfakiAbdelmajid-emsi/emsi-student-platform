from pydantic import BaseModel
from datetime import datetime

class ExamBase(BaseModel):
    title: str
    exam_date: datetime
    priority: int

class ExamCreate(ExamBase):
    pass

class ExamOut(ExamBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True  # Orm_mode in older Pydantic versions
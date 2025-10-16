from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class HelpAnnouncementCreate(BaseModel):
    title: str
    categorie: str
    contact_method: str  # "email" or "phone"
    contact_value: Optional[str] = None  # Either an email or phone number
    status: Optional[str] = "open"

    @validator("contact_method")
    def validate_method(cls, v):
        if v not in ("email", "phone"):
            raise ValueError("contact_method must be 'email' or 'phone'")
        return v


class HelpAnnouncementUpdate(BaseModel):
    title: Optional[str]
    contact_method: str  # "email" or "phone"
    contact_value: Optional[str] = None
    status: Optional[str]
    categorie: Optional[str]
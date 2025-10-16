from enum import Enum
from pydantic import BaseModel,validator
from typing import Optional, Literal

class AcademicLevel(str, Enum):
    CP1 = "CP1"  # 1st Year Preparatory
    CP2 = "CP2"  # 2nd Year Preparatory
    GI1 = "GI1"  # 1st Year Engineering
    GI2 = "GI2"  # 2nd Year Engineering
    GI3 = "GI3"  # 3rd Year Engineering

class Specialization(str, Enum):
    INFORMATIQUE = "Ingénierie Informatique et Réseaux"
    ELECTRIQUE = "Génie Electrique et Systèmes Intelligents"
    CIVIL = "Génie Civil, Bâtiments et Travaux Publics (BTP)"
    INDUSTRIEL = "Génie Industriel"
    FINANCIER = "Génie Financier"

class ProfileData(BaseModel):
    full_name: str
    academic_level: AcademicLevel # Optional email field
    specialization: Optional[Specialization] = None
    is_anonymous: bool = False
    image_url: Optional[str] = None  # New field for profile image URL

    # Add validation for specialization requirement
    @validator('specialization')
    def validate_specialization(cls, v, values):
        if values.get('academic_level') in ["GI1", "GI2", "GI3"] and not v:
            raise ValueError("Specialization is required for engineering years")
        return v
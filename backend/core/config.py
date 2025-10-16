from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "EMSI Platform"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    SUPABASE_URL: str
    SUPABASE_KEY: str
    CLIENT_ID: str
    CLIENT_SECRET: str
    ENVIRONMENT: Optional[str] = "development"
    SITE_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"  # Add this line
    REDIRECT_URI: str
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
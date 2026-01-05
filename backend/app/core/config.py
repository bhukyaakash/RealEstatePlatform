from pydantic_settings import BaseSettings
from typing import List
import json
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Real Estate Platform"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres123@localhost:5432/realestate_db")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

    FIRST_SUPERUSER_EMAIL: str = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@example.com")
    FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD", "admin123")

    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

    GEOAPIFY_API_KEY: str = os.getenv("GEOAPIFY_API_KEY", "")

    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# allow overriding via JSON list in env
try:
    raw = os.getenv("BACKEND_CORS_ORIGINS")
    if raw:
        settings.BACKEND_CORS_ORIGINS = json.loads(raw)
except Exception:
    pass

from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    database_url: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/axiforge_workshop"
    )
    secret_key: str = "your-secret-key-change-in-production"
    environment: str = "development"
    port: int = 8000
    upload_dir: str = str(Path(__file__).parent.parent.parent / "uploads")

    class Config:
        env_file = ".env"


settings = Settings()

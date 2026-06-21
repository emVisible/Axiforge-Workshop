from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/axiforge_workshop"
    secret_key: str = "your-secret-key-change-in-production"
    environment: str = "development"
    port: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/sih_db"
    SECRET_KEY: str = "change-me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    class Config:
        env_file = ".env"

settings = Settings()

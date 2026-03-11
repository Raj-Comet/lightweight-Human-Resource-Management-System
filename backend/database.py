import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Database URL - SQLite for simplicity, can be switched to PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hrms.db")

engine = create_engine(
    DATABASE_URL if "postgresql" in DATABASE_URL else "sqlite:///./hrms.db",
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

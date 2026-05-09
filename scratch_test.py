import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy.orm import Mapped, mapped_column, declarative_base
from sqlalchemy import String
from typing import Optional
from datetime import datetime

# Share metadata with SQLModel so create_all works for everything
Base = declarative_base(metadata=SQLModel.metadata)

class User(SQLAlchemyBaseUserTable[str], Base):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(nullable=True)
    failed_login_attempts: Mapped[int] = mapped_column(default=0, nullable=False)
    locked_until: Mapped[Optional[datetime]] = mapped_column(nullable=True)

engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=True)
async def main():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    print("Success")

asyncio.run(main())

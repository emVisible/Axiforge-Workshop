from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid

from ..database import Base

class Character(Base):
    __tablename__ = "characters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    author_id = Column(String(255), nullable=False, default="anonymous")  # 暂时匿名，后续集成认证
    character_data = Column(JSONB, nullable=False)
    is_public = Column(Boolean, default=False)
    tags = Column(JSONB, default=list)
    fork_from = Column(UUID(as_uuid=True), nullable=True)  # Fork 来源
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


class EmotionalTriggers(BaseModel):
    喜悦: List[str] = Field(default_factory=list, description="触发喜悦的事件")
    愤怒: List[str] = Field(default_factory=list, description="触发愤怒的事件")
    悲伤: List[str] = Field(default_factory=list, description="触发悲伤的事件")


class CharacterCore(BaseModel):
    name: str = Field(..., description="角色名")
    archetype: str = Field(..., description="一句话本质概括")
    voice: str = Field(..., description="标志性口头禅/说话风格")
    core_memory: str = Field(..., description="定义人格的关键记忆")
    desire: str = Field(..., description="深层欲望")
    fear: str = Field(..., description="核心恐惧")


class CharacterLayers(BaseModel):
    surface: str = Field(..., description="初次见面时的表现")
    intimate: str = Field(..., description="熟悉后的真实自我")
    under_stress: str = Field(..., description="压力下的崩坏/爆发模式")


class CharacterDynamics(BaseModel):
    emotional_triggers: EmotionalTriggers = Field(default_factory=EmotionalTriggers)
    growth_arc: str = Field("", description="角色成长方向")
    relationship_patterns: str = Field("", description="人际模式")


class CharacterData(BaseModel):
    core: CharacterCore
    layers: CharacterLayers
    dynamics: CharacterDynamics = Field(default_factory=CharacterDynamics)


class CharacterCreate(BaseModel):
    name: str
    character_data: CharacterData
    is_public: bool = False
    tags: List[str] = Field(default_factory=list)


class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    character_data: Optional[CharacterData] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None


class CharacterResponse(BaseModel):
    id: UUID
    name: str
    author_id: str
    character_data: Dict[str, Any]
    is_public: bool
    tags: List[str]
    fork_from: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CharacterPreview(BaseModel):
    character_id: UUID
    message: str = Field(..., description="发送给角色的消息")


class CharacterForkRequest(BaseModel):
    new_name: Optional[str] = Field(None, description="Fork后的新名称")
    author_id: str = Field("anonymous", description="新作者ID")


class CharacterForkResponse(BaseModel):
    original: CharacterResponse
    forked: CharacterResponse

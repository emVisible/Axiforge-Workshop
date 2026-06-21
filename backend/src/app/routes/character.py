from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas.character import (
    CharacterCreate,
    CharacterForkRequest,
    CharacterPreview,
    CharacterResponse,
    CharacterUpdate,
)
from ..services.character import CharacterService

router = APIRouter(prefix="/api/v1/characters", tags=["characters"])


@router.post("/", response_model=CharacterResponse, status_code=201)
async def create_character(
    character: CharacterCreate, db: AsyncSession = Depends(get_db)
):
    service = CharacterService(db)
    return await service.create_character(character)


@router.get("/public", response_model=List[CharacterResponse])
async def list_public_characters(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = CharacterService(db)
    return await service.get_public_characters(skip=skip, limit=limit)


@router.get("/user/{author_id}", response_model=List[CharacterResponse])
async def list_user_characters(author_id: str, db: AsyncSession = Depends(get_db)):
    service = CharacterService(db)
    return await service.get_user_characters(author_id)


@router.get("/{character_id}", response_model=CharacterResponse)
async def get_character(character_id: UUID, db: AsyncSession = Depends(get_db)):
    service = CharacterService(db)
    character = await service.get_character(character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character


@router.put("/{character_id}", response_model=CharacterResponse)
async def update_character(
    character_id: UUID,
    character_update: CharacterUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = CharacterService(db)
    character = await service.update_character(character_id, character_update)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character


@router.delete("/{character_id}", status_code=204)
async def delete_character(character_id: UUID, db: AsyncSession = Depends(get_db)):
    service = CharacterService(db)
    deleted = await service.delete_character(character_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Character not found")


@router.post("/{character_id}/fork", response_model=CharacterResponse)
async def fork_character(
    character_id: UUID,
    fork_request: CharacterForkRequest = CharacterForkRequest(),
    db: AsyncSession = Depends(get_db),
):
    """Fork 一个角色，返回新创建的角色"""
    service = CharacterService(db)
    result = await service.fork_character(
        character_id,
        new_name=fork_request.new_name,
        new_author_id=fork_request.author_id,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Original character not found")

    _, forked = result
    return forked


@router.get("/{character_id}/fork-chain")
async def get_fork_chain(character_id: UUID, db: AsyncSession = Depends(get_db)):
    """获取角色的 Fork 链"""
    service = CharacterService(db)
    chain = await service.get_fork_chain(character_id)
    if not chain:
        raise HTTPException(status_code=404, detail="Character not found")

    return {
        "original_id": str(chain["original"].id),
        "original_name": chain["original"].name,
        "total_forks": chain["total_forks"],
        "chain": [
            {
                "id": str(c.id),
                "name": c.name,
                "author_id": c.author_id,
                "created_at": c.created_at.isoformat(),
                "is_current": c.id == character_id,
            }
            for c in chain["chain"]
        ],
    }


@router.post("/{character_id}/preview")
async def preview_character(
    character_id: UUID,
    preview: CharacterPreview,
    db: AsyncSession = Depends(get_db),
):
    """角色预览 - 当前为 Mock 实现，未来集成 Pota"""
    service = CharacterService(db)
    character = await service.get_character(character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    # Mock 预览逻辑 - 未来替换为 Pota API 调用
    char_data = character.character_data
    core = char_data.get("core", {})
    surface = char_data.get("layers", {}).get("surface", "")

    # 简单的模板回复
    mock_response = f"[{core.get('name', 'Unknown')}] 以{surface}的方式说: 我听到了你说'{preview.message}'，但我还在开发中..."

    return {
        "character_name": core.get("name"),
        "user_message": preview.message,
        "response": mock_response,
        "mode": "mock",
    }

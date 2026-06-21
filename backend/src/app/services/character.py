from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from ..models.character import Character
from ..schemas.character import CharacterCreate, CharacterUpdate


class CharacterService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_character(self, character: CharacterCreate) -> Character:
        db_character = Character(
            name=character.name,
            character_data=character.character_data.model_dump(),
            is_public=character.is_public,
            tags=character.tags,
        )
        self.db.add(db_character)
        await self.db.commit()
        await self.db.refresh(db_character)
        return db_character

    async def get_character(self, character_id: UUID) -> Optional[Character]:
        result = await self.db.execute(
            select(Character).where(Character.id == character_id)
        )
        return result.scalar_one_or_none()

    async def get_public_characters(
        self, skip: int = 0, limit: int = 20
    ) -> List[Character]:
        result = await self.db.execute(
            select(Character)
            .where(Character.is_public == True)
            .order_by(Character.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_user_characters(self, author_id: str) -> List[Character]:
        result = await self.db.execute(
            select(Character).where(Character.author_id == author_id)
        )
        return result.scalars().all()

    async def update_character(
        self, character_id: UUID, update: CharacterUpdate
    ) -> Optional[Character]:
        character = await self.get_character(character_id)
        if not character:
            return None

        if update.name is not None:
            character.name = update.name
        if update.character_data is not None:
            character.character_data = update.character_data.model_dump()
        if update.is_public is not None:
            character.is_public = update.is_public
        if update.tags is not None:
            character.tags = update.tags

        await self.db.commit()
        await self.db.refresh(character)
        return character

    async def delete_character(self, character_id: UUID) -> bool:
        character = await self.get_character(character_id)
        if not character:
            return False
        await self.db.delete(character)
        await self.db.commit()
        return True

    async def fork_character(
        self,
        character_id: UUID,
        new_name: Optional[str] = None,
        new_author_id: str = "anonymous",
        modifications: Optional[dict] = None
    ) -> Optional[tuple]:
        """Fork 一个角色创建副本，返回 (original, forked)"""
        original = await self.get_character(character_id)
        if not original:
            return None

        # 深拷贝角色数据
        import copy
        forked_data = copy.deepcopy(original.character_data)

        # 确定新名称
        if new_name:
            final_name = new_name
        else:
            # 自动生成名称
            base_name = original.name.replace(" (Fork)", "")
            result = await self.db.execute(
                select(Character)
                .where(Character.fork_from == character_id)
                .where(Character.author_id == new_author_id)
            )
            existing_forks = result.scalars().all()

            if existing_forks:
                final_name = f"{base_name} (Fork {len(existing_forks) + 1})"
            else:
                final_name = f"{base_name} (Fork)"

        # 同步更新 character_data.core.name
        if "core" in forked_data and "name" in forked_data["core"]:
            forked_data["core"]["name"] = final_name

        forked = Character(
            name=final_name,
            author_id=new_author_id,
            character_data=forked_data,
            is_public=False,
            tags=original.tags.copy() if original.tags else [],
            fork_from=character_id,
        )

        self.db.add(forked)
        await self.db.commit()
        await self.db.refresh(forked)

        return (original, forked)

    async def get_fork_chain(self, character_id: UUID) -> dict:
        """获取 Fork 链（原始角色和所有 fork）"""
        character = await self.get_character(character_id)
        if not character:
            return None

        # 向上追溯原始角色
        original_id = character.fork_from or character.id
        original = await self.get_character(original_id)

        # 获取所有 fork
        result = await self.db.execute(
            select(Character)
            .where((Character.fork_from == original_id) | (Character.id == original_id))
            .order_by(Character.created_at)
        )
        chain = result.scalars().all()

        return {
            "original": original,
            "chain": chain,
            "total_forks": len([c for c in chain if c.id != original_id]),
        }

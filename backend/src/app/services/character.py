import copy
from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models.character import Character
from ..models.tag import Tag
from ..schemas.character import CharacterCreate, CharacterUpdate
from .tag import TagService


class CharacterService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.tag_service = TagService(db)

    async def create_character(self, character: CharacterCreate) -> Character:
        tags = await self.tag_service.get_or_create_tags(character.tag_names)
        name = character.character_data.contour.name or "未命名"

        db_character = Character(
            name=name,
            character_data=character.character_data.model_dump(),
            is_public=character.is_public,
            tags=tags,
        )
        self.db.add(db_character)
        await self.db.commit()

        result = await self.db.execute(
            select(Character)
            .where(Character.id == db_character.id)
            .options(selectinload(Character.tags))
        )
        db_character = result.scalar_one()

        await self.tag_service.update_tag_counts([t.id for t in tags])
        await self.db.commit()

        return db_character

    async def get_character(self, character_id: UUID) -> Optional[Character]:
        result = await self.db.execute(
            select(Character)
            .where(Character.id == character_id)
            .options(selectinload(Character.tags))
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
            .options(selectinload(Character.tags))
        )
        return result.scalars().unique().all()

    async def search_public_characters(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        tag_names: Optional[List[str]] = None,
        sort_by: str = "recent",
    ) -> Tuple[List[Character], int]:
        base = select(Character).where(Character.is_public == True)

        if tag_names:
            cleaned = [n.lower().strip() for n in tag_names if n.strip()]
            if cleaned:
                base = base.join(Character.tags).where(Tag.name.in_(cleaned))

        if search:
            term = f"%{search}%"
            base = base.where(
                or_(
                    Character.name.ilike(term),
                    Character.character_data["anchor"]["essence"].astext.ilike(term),
                    Character.character_data["contour"]["name"].astext.ilike(term),
                )
            )

        count_stmt = select(func.count()).select_from(base.subquery())
        total_result = await self.db.execute(count_stmt)
        total = total_result.scalar() or 0

        base = base.order_by(Character.created_at.desc())
        base = base.offset(skip).limit(limit).options(selectinload(Character.tags))

        result = await self.db.execute(base)
        characters = result.scalars().unique().all()

        return characters, total

    async def get_user_characters(self, author_id: str) -> List[Character]:
        result = await self.db.execute(
            select(Character)
            .where(Character.author_id == author_id)
            .order_by(Character.updated_at.desc())
            .options(selectinload(Character.tags))
        )
        return result.scalars().unique().all()

    async def update_character(
        self, character_id: UUID, update: CharacterUpdate
    ) -> Optional[Character]:
        character = await self.get_character(character_id)
        if not character:
            return None

        if update.character_data is not None:
            character.character_data = update.character_data.model_dump()
            # 同步 name
            character.name = update.character_data.contour.name or character.name
        if update.is_public is not None:
            character.is_public = update.is_public
        if update.tag_names is not None:
            tags = await self.tag_service.get_or_create_tags(update.tag_names)
            character.tags = tags
            await self.db.flush()
            await self.tag_service.update_tag_counts([t.id for t in tags])

        await self.db.commit()
        await self.db.refresh(character, ["tags"])
        return character

    async def delete_character(self, character_id: UUID) -> bool:
        character = await self.get_character(character_id)
        if not character:
            return False
        tag_ids = [t.id for t in character.tags]
        await self.db.delete(character)
        await self.db.commit()
        if tag_ids:
            await self.tag_service.update_tag_counts(tag_ids)
            await self.db.commit()
        return True

    async def fork_character(
        self,
        character_id: UUID,
        new_name: Optional[str] = None,
        new_author_id: str = "anonymous",
    ) -> Optional[Tuple[Character, Character]]:
        original = await self.get_character(character_id)
        if not original:
            return None

        forked_data = copy.deepcopy(original.character_data)

        if new_name:
            final_name = new_name
        else:
            base_name = original.name.replace(" (Fork)", "")
            result = await self.db.execute(
                select(Character)
                .where(Character.fork_from == character_id)
                .where(Character.author_id == new_author_id)
            )
            existing = result.scalars().all()
            final_name = (
                f"{base_name} (Fork {len(existing) + 1})"
                if existing
                else f"{base_name} (Fork)"
            )

        if "contour" in forked_data:
            forked_data["contour"]["name"] = final_name

        forked = Character(
            name=final_name,
            author_id=new_author_id,
            character_data=forked_data,
            is_public=False,
            tags=original.tags,
            fork_from=character_id,
        )
        self.db.add(forked)
        await self.db.commit()
        await self.db.refresh(forked, ["tags"])

        return (original, forked)

    async def get_fork_chain(self, character_id: UUID) -> Optional[dict]:
        character = await self.get_character(character_id)
        if not character:
            return None

        original_id = character.fork_from or character.id
        original = await self.get_character(original_id)

        result = await self.db.execute(
            select(Character)
            .where((Character.fork_from == original_id) | (Character.id == original_id))
            .order_by(Character.created_at)
            .options(selectinload(Character.tags))
        )
        chain = result.scalars().unique().all()

        return {
            "original": original,
            "chain": chain,
            "total_forks": len([c for c in chain if c.id != original_id]),
        }

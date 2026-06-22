import { Link } from "react-router";
import type { Character } from "@/types/character";

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const { contour, anchor, demeanor } = character.character_data;
  const displayName = character.name || contour?.name || "未命名角色";

  return (
    <Link
      to={`/characters/${character.id}`}
      className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300 hover:border-gray-200 group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform flex-shrink-0">
          {displayName[0] || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {displayName}
          </h3>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {anchor?.essence || "等待定义..."}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
        {demeanor?.speech_style ||
          contour?.first_impression ||
          "还没有设定描述"}
      </p>

      <div className="flex flex-wrap gap-1">
        {character.tags.map((tag) => (
          <span
            key={tag.id}
            className="px-2 py-0.5 text-[11px] font-medium rounded-full border"
            style={{
              color: tag.color,
              borderColor: tag.color + "40",
              backgroundColor: tag.color + "10",
            }}
          >
            {tag.name}
          </span>
        ))}
        <span
          className={`px-2 py-0.5 text-[11px] rounded-full border ${
            character.is_public
              ? "text-emerald-600 border-emerald-200 bg-emerald-50"
              : "text-gray-400 border-gray-200 bg-gray-50"
          }`}
        >
          {character.is_public ? "公开" : "私有"}
        </span>
      </div>
    </Link>
  );
}

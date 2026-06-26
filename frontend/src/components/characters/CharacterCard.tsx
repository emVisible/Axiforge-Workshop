import { Link } from "react-router";
import type { Character } from "@/types/character";

interface CharacterCardProps {
  character: Character;
  showStatus?: boolean;
}

function formatViews(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function CharacterCard({
  character,
  showStatus = false,
}: CharacterCardProps) {
  const { anchor, demeanor, contour } = character.character_data;
  const displayName = character.name || anchor?.name || "未命名角色";

  return (
    <Link
      to={`/characters/${character.id}`}
      className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300 hover:border-gray-200 group relative"
    >
      {showStatus && (
        <span
          className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] rounded-full border ${
            character.is_public
              ? "text-emerald-600 border-emerald-200 bg-emerald-50"
              : "text-gray-400 border-gray-200 bg-gray-50"
          }`}
        >
          {character.is_public ? "公开" : "私有"}
        </span>
      )}

      <div className="flex items-center gap-3 mb-3">
        {character.image_path ? (
          <img
            src={character.image_path}
            alt=""
            className="w-11 h-11 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
            {displayName[0] || "?"}
          </div>
        )}
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
        {anchor?.summary ||
          demeanor?.speech_style ||
          contour?.first_impression ||
          "还没有设定描述"}
      </p>

      <div className="flex flex-wrap gap-1">
        {(character.view_count ?? 0) > 0 && (
          <span className="px-2 py-0.5 text-[11px] text-gray-400 bg-gray-50 rounded-full border border-gray-200 flex items-center gap-0.5">
            🔥 {formatViews(character.view_count ?? 0)}
          </span>
        )}
        {character.tags.slice(0, 3).map((tag) => (
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
        {character.tags.length > 3 && (
          <span className="px-2 py-0.5 text-[11px] text-gray-400 bg-gray-50 rounded-full border border-gray-200">
            +{character.tags.length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}

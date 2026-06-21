import { Link } from "react-router";
import type { Character } from "@/types/character";

interface CharacterCardProps {
  character: Character;
}
export default function CharacterCard({ character }: CharacterCardProps) {
  const { core } = character.character_data;

  // 优先使用 character.name，fallback 到 core.name
  const displayName = character.name || core.name || "未命名角色";

  return (
    <Link
      to={`/characters/${character.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-blue-300 group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
          {displayName[0] || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {displayName}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {core.archetype || "等待定义..."}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {core.voice || "还没有设定说话风格"}
        </p>

        {character.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {character.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <span>{character.is_public ? "🌐 公开" : "🔒 私有"}</span>
        <span>{new Date(character.created_at).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}

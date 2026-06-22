import { useState, useEffect, useRef } from "react";
import { usePublicCharacters } from "@/hooks/useCharacters";
import type { Character } from "@/types/character";

interface CharacterSearchSelectProps {
  value: string;
  onChange: (characterId: string, characterName: string) => void;
  placeholder?: string;
  excludeId?: string; // 排除当前角色
}

export default function CharacterSearchSelect({
  value,
  onChange,
  placeholder = "搜索角色...",
  excludeId,
}: CharacterSearchSelectProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = usePublicCharacters({
    search: debouncedSearch || undefined,
    limit: 8,
  });

  // 点击外部关闭
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (character: Character) => {
    onChange(character.id, character.name);
    setSelectedName(character.name);
    setSearch("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("", "");
    setSelectedName("");
    setSearch("");
  };

  const filtered = data?.items.filter(c => c.id !== excludeId) || [];

  return (
    <div ref={containerRef} className="relative">
      {selectedName ? (
        <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50">
          <span className="text-sm text-gray-700 flex-1">{selectedName}</span>
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            × 清除
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
        />
      )}

      {isOpen && (search || isLoading) && !selectedName && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-400">搜索中...</div>
          )}
          {!isLoading && filtered.length === 0 && search && (
            <div className="px-4 py-3 text-sm text-gray-400">没有找到角色</div>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {(c.character_data?.contour?.name || c.name)[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {c.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {c.character_data?.anchor?.essence || c.character_data?.contour?.first_impression || ""}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
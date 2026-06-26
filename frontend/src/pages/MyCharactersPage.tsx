import { useState, useEffect } from "react";
import { useUserCharacters } from "@/hooks/useCharacters";
import { CharacterGrid } from "@/components/characters";
import {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  Button,
} from "@/components/ui";

const TEMP_USER_ID = "anonymous";
const PAGE_SIZE = 12;

export default function MyCharactersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: allCharacters,
    isLoading,
    error,
  } = useUserCharacters(TEMP_USER_ID);

  const filtered =
    allCharacters?.filter((c) => {
      if (!debouncedSearch) return true;
      const term = debouncedSearch.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.character_data?.anchor?.essence?.toLowerCase().includes(term) ||
        c.character_data?.anchor?.summary?.toLowerCase().includes(term) ||
        c.tags.some((t) => t.name.toLowerCase().includes(term))
      );
    }) || [];

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // 搜索变化时重置分页
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch]);

  return (
    <div className="animate-fadeIn">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的角色</h1>
          <p className="text-sm text-gray-400 mt-1">
            {allCharacters
              ? `${filtered.length} 个角色`
              : "管理和编辑你创建的角色"}
          </p>
        </div>
        <Button as="link" to="/create" size="sm">
          创建新角色
        </Button>
      </div>

      {/* 搜索 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索我的角色..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
        {search && (
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>找到 {filtered.length} 个匹配角色</span>
            <button
              onClick={() => setSearch("")}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              清除
            </button>
          </div>
        )}
      </div>

      {isLoading && <LoadingSpinner />}
      {error && (
        <ErrorDisplay
          message="加载角色失败"
          onRetry={() => window.location.reload()}
        />
      )}
      {!isLoading && filtered.length === 0 && (
        <EmptyState
          title={search ? "没有匹配的角色" : "你还没有创建角色"}
          description={search ? "试试其他关键词" : "开始创建你的第一个角色吧"}
          action={search ? undefined : { label: "创建角色", to: "/create" }}
        />
      )}

      {visible.length > 0 && (
        <>
          <CharacterGrid characters={visible} showStatus />
          <div className="mt-8 text-center">
            {hasMore && (
              <Button
                variant="secondary"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                加载更多（{filtered.length - visibleCount} 个剩余）
              </Button>
            )}
            {!hasMore && filtered.length > PAGE_SIZE && (
              <p className="text-sm text-gray-300">
                已显示全部 {filtered.length} 个角色
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

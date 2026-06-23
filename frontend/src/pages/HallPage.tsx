import { useState, useEffect, useCallback } from "react";
import { usePublicCharacters } from "@/hooks/useCharacters";
import { useTags } from "@/hooks/useTags";
import { CharacterGrid } from "@/components/characters";
import {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  Button,
} from "@/components/ui";

const PAGE_SIZE = 12;
const MAX_VISIBLE_TAGS = 15;

export default function HallPage() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<"recent" | "popular">("recent");
  const [page, setPage] = useState(0);
  const [allCharacters, setAllCharacters] = useState<any[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 筛选条件变化时重置页码和列表
  useEffect(() => {
    setPage(0);
    setAllCharacters([]);
  }, [debouncedSearch, selectedTags, sort]);

  const skip = page * PAGE_SIZE;

  const {
    data: result,
    isLoading,
    error,
  } = usePublicCharacters({
    search: debouncedSearch || undefined,
    tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
    sort,
    skip,
    limit: PAGE_SIZE,
  });

  // 追加数据
  useEffect(() => {
    if (result) {
      if (page === 0) {
        setAllCharacters(result.items);
      } else {
        setAllCharacters((prev) => [...prev, ...result.items]);
      }
    }
  }, [result, page]);

  const { data: allTags } = useTags("usage");

  const toggleTag = useCallback((tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName],
    );
  }, []);

  const clearFilters = () => {
    setSearch("");
    setSelectedTags([]);
    setSort("recent");
  };

  const hasFilters = search || selectedTags.length > 0;
  const hasMore = result ? skip + PAGE_SIZE < result.total : false;
  const visibleTags = allTags || [];
  const displayTags = showAllTags
    ? visibleTags
    : visibleTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = visibleTags.length - MAX_VISIBLE_TAGS;

  return (
    <div className="animate-fadeIn">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">角色大厅</h1>
          <p className="text-sm text-gray-400 mt-1">
            {result ? `共 ${result.total} 个公开角色` : "浏览社区分享的角色"}
          </p>
        </div>
        <Button as="link" to="/create" size="sm">
          创建角色
        </Button>
      </div>

      {/* 搜索 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
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
            placeholder="搜索角色名、本质概括..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* 标签云 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            标签筛选
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSort("recent")}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                sort === "recent"
                  ? "bg-gray-100 text-gray-700 font-medium"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              最新
            </button>
            <button
              onClick={() => setSort("popular")}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                sort === "popular"
                  ? "bg-gray-100 text-gray-700 font-medium"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              最热
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 px-2 py-1 text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                清除
              </button>
            )}
          </div>
        </div>

        {visibleTags.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-1.5">
              {displayTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.name)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
                    selectedTags.includes(tag.name)
                      ? "shadow-sm scale-105"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    color: selectedTags.includes(tag.name) ? "#fff" : tag.color,
                    borderColor: tag.color + "40",
                    backgroundColor: selectedTags.includes(tag.name)
                      ? tag.color
                      : tag.color + "10",
                  }}
                >
                  {tag.name}
                  {tag.usage_count > 0 && (
                    <span className="ml-1 opacity-60">{tag.usage_count}</span>
                  )}
                </button>
              ))}
              {hiddenCount > 0 && !showAllTags && (
                <button
                  onClick={() => setShowAllTags(true)}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  +{hiddenCount} 更多
                </button>
              )}
              {showAllTags && hiddenCount > 0 && (
                <button
                  onClick={() => setShowAllTags(false)}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  收起
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-300">
            还没有标签，创建角色时添加标签吧
          </p>
        )}
      </div>

      {/* 角色列表 */}
      {isLoading && page === 0 && <LoadingSpinner />}

      {error && (
        <ErrorDisplay
          message="加载角色失败"
          onRetry={() => window.location.reload()}
        />
      )}

      {result && allCharacters.length === 0 && (
        <EmptyState
          title={hasFilters ? "没有匹配的角色" : "大厅空空如也"}
          description={
            hasFilters
              ? "试试其他关键词或标签"
              : "还没有公开的角色，成为第一个分享的人吧！"
          }
          action={hasFilters ? undefined : { label: "创建角色", to: "/create" }}
        />
      )}

      {allCharacters.length > 0 && (
        <>
          <CharacterGrid characters={allCharacters} />

          {/* 加载更多 */}
          <div className="mt-8 text-center">
            {isLoading && page > 0 && <LoadingSpinner />}
            {hasMore && !isLoading && (
              <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                加载更多（{result!.total - (skip + PAGE_SIZE)} 个剩余）
              </Button>
            )}
            {!hasMore && allCharacters.length > 0 && (
              <p className="text-sm text-gray-300">
                已显示全部 {result?.total} 个角色
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

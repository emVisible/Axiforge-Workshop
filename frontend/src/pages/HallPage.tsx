import { usePublicCharacters } from "@/hooks/useCharacters";
import { CharacterGrid } from "@/components/characters";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/components/ui";
import { Link } from "react-router";

export default function HallPage() {
  const { data: characters, isLoading, error } = usePublicCharacters();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">角色大厅</h1>
          <p className="mt-2 text-gray-600">
            浏览社区分享的角色，发现灵感或直接使用
          </p>
        </div>
        <Link
          to="/create"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          创建角色
        </Link>
      </div>

      {isLoading && <LoadingSpinner />}

      {error && (
        <ErrorDisplay
          message="加载角色失败，请检查后端服务是否运行"
          onRetry={() => window.location.reload()}
        />
      )}

      {characters && characters.length === 0 && (
        <EmptyState
          title="大厅空空如也"
          description="还没有公开的角色，成为第一个分享的人吧！"
          action={{ label: "创建角色", to: "/create" }}
        />
      )}

      {characters && characters.length > 0 && (
        <CharacterGrid characters={characters} />
      )}
    </div>
  );
}

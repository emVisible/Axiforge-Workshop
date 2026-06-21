import { Link } from "react-router";
import { useUserCharacters } from "@/hooks/useCharacters";
import { CharacterGrid } from "@/components/characters";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/components/ui";

// 临时使用匿名用户ID，后期集成认证系统
const TEMP_USER_ID = "anonymous";

export default function MyCharactersPage() {
  const {
    data: characters,
    isLoading,
    error,
  } = useUserCharacters(TEMP_USER_ID);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">我的角色</h1>
          <p className="mt-2 text-gray-600">管理和编辑你创建的角色</p>
        </div>
        <Link
          to="/create"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          创建新角色
        </Link>
      </div>

      {isLoading && <LoadingSpinner />}

      {error && (
        <ErrorDisplay
          message="加载角色失败"
          onRetry={() => window.location.reload()}
        />
      )}

      {characters && characters.length === 0 && (
        <EmptyState
          title="你还没有创建角色"
          description="开始创建你的第一个角色吧"
          action={{ label: "创建角色", to: "/create" }}
        />
      )}

      {characters && characters.length > 0 && (
        <CharacterGrid characters={characters} />
      )}
    </div>
  );
}

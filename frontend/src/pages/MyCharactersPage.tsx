import { Link } from "react-router";
import { useUserCharacters } from "@/hooks/useCharacters";
import { CharacterGrid } from "@/components/characters";
import {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  Button,
} from "@/components/ui";

const TEMP_USER_ID = "anonymous";

export default function MyCharactersPage() {
  const {
    data: characters,
    isLoading,
    error,
  } = useUserCharacters(TEMP_USER_ID);

  return (
    <div className="animate-fadeIn">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的角色</h1>
          <p className="text-sm text-gray-400 mt-1">管理和编辑你创建的角色</p>
        </div>
        <Button as="link" to="/create" size="sm">
          创建新角色
        </Button>
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

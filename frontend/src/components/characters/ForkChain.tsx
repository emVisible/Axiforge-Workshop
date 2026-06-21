import { useForkChain } from "@/hooks/useCharacters";
import { Link } from "react-router";

interface ForkChainProps {
  characterId: string;
}

export default function ForkChain({ characterId }: ForkChainProps) {
  const { data: chain, isLoading } = useForkChain(characterId);

  if (isLoading) return <div className="text-sm text-gray-400">加载中...</div>;
  if (!chain || chain.total_forks === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">
          Fork 链 ({chain.total_forks} 个分支)
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {chain.chain.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            <Link
              to={`/characters/${item.id}`}
              className={`
                px-3 py-1 rounded-full text-sm transition-colors
                ${
                  item.is_current
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {item.name}
              {item.is_current && " (当前)"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

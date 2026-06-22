import { useForkChain } from "@/hooks/useCharacters";
import { Link } from "react-router";

interface ForkChainProps {
  characterId: string;
}

export default function ForkChain({ characterId }: ForkChainProps) {
  const { data: chain, isLoading } = useForkChain(characterId);

  if (isLoading) return null;
  if (!chain || chain.total_forks === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
        <span>🔀 Fork 链</span>
        <span>({chain.total_forks} 个分支)</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {chain.chain.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            {index > 0 && <span className="text-gray-300">→</span>}
            <Link
              to={`/characters/${item.id}`}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                item.is_current
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

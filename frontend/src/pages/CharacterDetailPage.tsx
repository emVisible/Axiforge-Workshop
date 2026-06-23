import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  useCharacter,
  useDeleteCharacter,
  useForkCharacter,
} from "@/hooks/useCharacters";
import { characterApi } from "@/api/characters";
import { ErrorDisplay, Button } from "@/components/ui";
import {
  ForkDialog,
  ForkChain,
  PromptExport,
  RelationList,
  AddRelationDialog,
  RelationGraph,
} from "@/components/characters";
import type { PreviewResponse, CharacterData } from "@/types/character";
import Skeleton from "@/components/ui/Skeleton";
import VersionPanel from "@/components/characters/VersionPanel";

const layerTabs = [
  {
    key: "anchor",
    label: "锚点",
    icon: "⚓",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    key: "psyche",
    label: "内心",
    icon: "🧠",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    key: "contour",
    label: "轮廓",
    icon: "👤",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    key: "demeanor",
    label: "举止",
    icon: "🎭",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    key: "trace",
    label: "轨迹",
    icon: "📜",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    key: "bond",
    label: "羁绊",
    icon: "🔗",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

const fieldLabels: Record<string, Record<string, string>> = {
  contour: {
    name: "姓名",
    appearance: "外貌",
    age_era: "年龄/时代",
    identity: "身份",
    first_impression: "第一印象",
  },
  demeanor: {
    speech_style: "说话方式",
    habits: "习惯",
    typical_reaction: "常见反应",
    expressiveness: "情绪外露",
  },
  psyche: {
    desire: "深层欲望",
    fear: "核心恐惧",
    conflict: "内在矛盾",
    self_perception: "自我认知",
  },
  anchor: { essence: "本质概括", theme: "人生主题", core_belief: "核心信念" },
  trace: { background: "出身背景", turning_point: "转折点" },
  bond: {
    attitude_to_others: "对他人态度",
    intimate_pattern: "亲密关系",
    hostile_pattern: "敌对关系",
    group_role: "群体角色",
  },
};

const mainTabs = [
  { key: "info" as const, label: "📋 角色信息" },
  { key: "preview" as const, label: "💬 对话预览" },
  { key: "export" as const, label: "📤 导出" },
  { key: "relations" as const, label: "🕸️ 关系" },
  { key: "versions" as const, label: "🕰️ 版本" },
];

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: character, isLoading, error } = useCharacter(id!);
  const deleteCharacter = useDeleteCharacter();
  const forkCharacter = useForkCharacter();

  const [isForkOpen, setIsForkOpen] = useState(false);
  const [isAddRelationOpen, setIsAddRelationOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState("anchor");
  const [activeTab, setActiveTab] = useState<
    "info" | "preview" | "export" | "relations" | "versions"
  >("info");
  const [message, setMessage] = useState("");
  const [previewResponse, setPreviewResponse] =
    useState<PreviewResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn space-y-6">
        <Skeleton className="h-4 w-24" />
        <div className="bg-white rounded-2xl p-8 space-y-4">
          <div className="flex gap-6">
            <Skeleton className="w-20 h-20 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error)
    return (
      <ErrorDisplay
        message="加载角色失败"
        onRetry={() => window.location.reload()}
      />
    );
  if (!character) return <ErrorDisplay message="角色不存在" />;

  const cd = character.character_data as CharacterData;
  const displayName = character.name || cd?.anchor?.name || "未命名";

  const handleDelete = async () => {
    if (!confirm("确定要删除这个角色吗？此操作不可撤销。")) return;
    try {
      await deleteCharacter.mutateAsync(character.id);
      navigate("/my-characters");
    } catch (err) {
      console.error("删除失败:", err);
      alert("删除失败");
    }
  };

  const handleFork = async (newName: string) => {
    const forked = await forkCharacter.mutateAsync({
      id: character.id,
      forkRequest: { new_name: newName },
    });
    navigate(`/characters/${forked.id}`);
  };

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(character.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePreview = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      const response = await characterApi.preview(character.id, message);
      setPreviewResponse(response);
      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const renderLayerFields = (layerKey: string) => {
    const data = (cd as any)[layerKey];
    if (!data) return <p className="text-gray-400 text-sm">未设定</p>;

    if (layerKey === "trace") {
      const hasTrace =
        data.background || data.turning_point || data.key_events?.length > 0;
      if (!hasTrace) return <p className="text-gray-400 text-sm">未设定</p>;
      return (
        <div className="space-y-3">
          {data.background && (
            <FieldRow label="出身背景" value={data.background} />
          )}
          {data.turning_point && (
            <FieldRow label="转折点" value={data.turning_point} />
          )}
          {data.key_events?.length > 0 && (
            <div>
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                关键事件
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {data.key_events.map((e: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200"
                  >
                    {e}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </div>
      );
    }

    const entries = Object.entries(data).filter(([k]) => k !== "key_events");
    const filled = entries.filter(([_, v]) => v);
    if (filled.length === 0)
      return <p className="text-gray-400 text-sm">未设定</p>;

    return (
      <div className="space-y-3">
        {filled.map(([key, value]) => (
          <FieldRow
            key={key}
            label={fieldLabels[layerKey]?.[key] || key}
            value={value as string}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* 对话框 */}
      <ForkDialog
        character={character}
        isOpen={isForkOpen}
        onClose={() => setIsForkOpen(false)}
        onFork={handleFork}
        isForking={forkCharacter.isPending}
      />
      <AddRelationDialog
        characterId={character.id}
        isOpen={isAddRelationOpen}
        onClose={() => setIsAddRelationOpen(false)}
      />

      {/* 面包屑 */}
      <nav className="mb-6">
        <Link
          to="/hall"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 大厅
        </Link>
      </nav>

      {/* Fork 链 */}
      <ForkChain characterId={character.id} />

      {/* 头部卡片 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
        <div className="flex items-start gap-6">
          {character.image_path ? (
            <img
              src={character.image_path}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-purple-200 flex-shrink-0">
              {displayName[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {displayName}
            </h1>
            {cd?.anchor?.essence && (
              <p className="text-gray-500 mb-3">{cd.anchor.essence}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {character.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2.5 py-1 text-xs font-medium rounded-full border"
                  style={{
                    color: tag.color,
                    borderColor: tag.color + "40",
                    backgroundColor: tag.color + "10",
                  }}
                >
                  {tag.name}
                </span>
              ))}
              <span
                className={`px-2.5 py-1 text-xs rounded-full border ${
                  character.is_public
                    ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                    : "text-gray-400 border-gray-200 bg-gray-50"
                }`}
              >
                {character.is_public ? "🌐 公开" : "🔒 私有"}
              </span>
            </div>
            {/* 角色 ID */}
            <div className="flex items-center gap-2">
              <code className="text-xs text-gray-300 select-all bg-gray-50 px-2 py-0.5 rounded">
                {character.id}
              </code>
              <button
                onClick={handleCopyId}
                className="text-xs text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
              >
                {copiedId ? "✓ 已复制" : "📋 复制ID"}
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button
              as="link"
              to={`/characters/${character.id}/edit`}
              variant="secondary"
              size="sm"
            >
              编辑
            </Button>
            <Button
              onClick={() => setIsForkOpen(true)}
              variant="secondary"
              size="sm"
            >
              Fork
            </Button>
            <Button onClick={handleDelete} variant="danger" size="sm">
              删除
            </Button>
          </div>
        </div>

        {character.fork_from && (
          <div className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-400">
            Fork 自{" "}
            <Link
              to={`/characters/${character.fork_from}`}
              className="text-blue-500 hover:text-blue-600"
            >
              原始角色
            </Link>
          </div>
        )}
      </div>

      {/* 主标签切换 */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {mainTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* === 角色信息 === */}
      {activeTab === "info" && (
        <div className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            {layerTabs.map(({ key, label, icon, color }) => (
              <button
                key={key}
                onClick={() => setActiveLayer(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  activeLayer === key
                    ? color + " shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {layerTabs.find((l) => l.key === activeLayer)?.icon}{" "}
              {layerTabs.find((l) => l.key === activeLayer)?.label}
            </h2>
            {renderLayerFields(activeLayer)}
          </div>
        </div>
      )}

      {/* === 对话预览 === */}
      {activeTab === "preview" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">对话预览</h2>
          <p className="text-sm text-gray-400 mb-6">
            测试角色对话（Mock 模式）
          </p>

          {previewResponse && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3 max-h-64 overflow-y-auto">
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[70%] text-sm">
                  {previewResponse.user_message}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[70%] shadow-sm">
                  <p className="text-xs text-gray-400 mb-1">
                    {previewResponse.character_name}
                  </p>
                  <p className="text-sm text-gray-700">
                    {previewResponse.response}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePreview()}
              placeholder="输入消息..."
              disabled={isSending}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-sm"
            />
            <Button
              onClick={handlePreview}
              disabled={isSending || !message.trim()}
              size="md"
            >
              {isSending ? "..." : "发送"}
            </Button>
          </div>
        </div>
      )}

      {/* === 导出 === */}
      {activeTab === "export" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            导出 Prompt
          </h2>
          <PromptExport
            characterData={cd}
            characterName={displayName}
            characterId={character.id}
            tags={character.tags}
          />
        </div>
      )}

      {/* === 关系 === */}
      {activeTab === "relations" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">关系图谱</h2>
              <Button size="sm" onClick={() => setIsAddRelationOpen(true)}>
                + 添加关系
              </Button>
            </div>
            <RelationGraph characterId={character.id} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              关系列表
            </h2>
            <RelationList characterId={character.id} />
          </div>
        </div>
      )}
      {activeTab === "versions" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">版本历史</h2>
          <VersionPanel characterId={character.id} />
        </div>
      )}

      {/* 元数据 */}
      <div className="mt-6 text-xs text-gray-300 flex justify-between">
        <span>
          创建于 {new Date(character.created_at).toLocaleDateString()}
        </span>
        <span>
          更新于 {new Date(character.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </dt>
      <dd className="text-sm text-gray-700 leading-relaxed">{value}</dd>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  useCharacter,
  useDeleteCharacter,
  useForkCharacter,
} from "@/hooks/useCharacters";
import { ErrorDisplay, Button } from "@/components/ui";
import {
  ForkDialog,
  ForkChain,
  RelationList,
  AddRelationDialog,
  RelationGraph,
} from "@/components/characters";
import type { CharacterData } from "@/types/character";
import Skeleton from "@/components/ui/Skeleton";
import StoryList from "@/components/characters/StoryList";
import CreateStoryDialog from "@/components/characters/CreateStoryDialog";
import VersionPanel from "@/components/characters/VersionPanel";
import { versionApi } from "@/api/versions";
import { characterApi } from "@/api/characters";
import { renderCharacterPrompt } from "@/lib/promptRenderer";

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
  anchor: {
    name: "姓名",
    summary: "描述",
    essence: "概括",
    theme: "主题",
    core_belief: "信仰",
  },
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
  { key: "relations" as const, label: "🕸️ 关系" },
  { key: "stories" as const, label: "📖 传记" },
];

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: character, isLoading, error } = useCharacter(id!);
  const deleteCharacter = useDeleteCharacter();
  const forkCharacter = useForkCharacter();

  const [isForkOpen, setIsForkOpen] = useState(false);
  const [isAddRelationOpen, setIsAddRelationOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState("anchor");
  const [activeTab, setActiveTab] = useState<"info" | "relations" | "stories">(
    "info",
  );
  const [copiedId, setCopiedId] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { data: versions } = useQuery({
    queryKey: ["versions", character?.id],
    queryFn: () => versionApi.list(character!.id),
    enabled: !!character,
  });
  const versionsCount = versions?.length || 0;
  const handleExportMarkdown = async () => {
    if (!character) return;
    setExporting(true);
    try {
      const data = await characterApi.export(character.id, {
        format: "markdown",
        include_stories: true,
        include_relations: true,
      });

      let md = renderCharacterPrompt(
        character.character_data as CharacterData,
        "markdown",
      );

      if ((data as any).stories?.length) {
        md += "\n\n## 传记\n\n";
        (data as any).stories.forEach((s: any) => {
          md += `### ${s.title}\n\n${s.content}\n\n`;
        });
      }
      if ((data as any).relations?.length) {
        md += "\n## 关系\n\n";
        (data as any).relations.forEach((r: any) => {
          md += `- ${r.relation_name}: ${r.target_name}\n`;
        });
      }

      const blob = new Blob([md], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `${character.name || "character"}.md`;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("导出失败", e);
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn space-y-6">
        <Skeleton className="h-4 w-24" />
        <div className="bg-white rounded-2xl p-8 space-y-4">
          <div className="flex gap-6">
            <Skeleton className="w-28 h-28 rounded-2xl" />
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
      <CreateStoryDialog
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
      />

      {isVersionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsVersionOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">版本历史</h2>
              <button
                onClick={() => setIsVersionOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>
            <VersionPanel characterId={character.id} />
          </div>
        </div>
      )}

      <nav className="mb-6">
        <Link
          to="/hall"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 返回
        </Link>
      </nav>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6 group/card relative overflow-hidden">
        <div className="absolute top-4 right-4 flex flex-col items-end gap-0.5 opacity-0 translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300 ease-out z-10">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsVersionOpen(true)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100 whitespace-nowrap"
            >
              🕰️ {versionsCount} 个版本
            </button>
            <button
              onClick={async () => {
                const url = window.location.href;
                try {
                  await navigator.clipboard.writeText(url);
                } catch {
                  const ta = document.createElement("textarea");
                  ta.value = url;
                  document.body.appendChild(ta);
                  ta.select();
                  document.execCommand("copy");
                  document.body.removeChild(ta);
                }
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="text-xs text-gray-400 hover:text-blue-500 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100 whitespace-nowrap"
            >
              {copiedLink ? "✓ 链接已复制" : "🔗 分享"}
            </button>
          </div>
          <div className="h-px bg-gray-100 my-0.5 w-8" />
          <Button
            as="link"
            to={`/characters/${character.id}/edit`}
            variant="ghost"
            size="sm"
          >
            ✏️ 编辑
          </Button>
          <Button onClick={() => setIsForkOpen(true)} variant="ghost" size="sm">
            🔀 Fork
          </Button>
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-500"
          >
            🗑️ 删除
          </Button>
          <div className="h-px bg-gray-100 my-0.5 w-8" />
          <div className="flex items-center gap-1">
            <button
              onClick={async () => {
                if (!character) return;
                setCopying(true);
                try {
                  const data = await characterApi.export(character.id, {
                    format: "markdown",
                    include_stories: true,
                    include_relations: true,
                  });
                  let md = renderCharacterPrompt(
                    character.character_data as CharacterData,
                    "markdown",
                  );
                  if ((data as any).stories?.length) {
                    md += "\n\n## 传记\n\n";
                    (data as any).stories.forEach((s: any) => {
                      md += `### ${s.title}\n\n${s.content}\n\n`;
                    });
                  }
                  if ((data as any).relations?.length) {
                    md += "\n## 关系\n\n";
                    (data as any).relations.forEach((r: any) => {
                      md += `- ${r.relation_name}: ${r.target_name}\n`;
                    });
                  }
                  try {
                    await navigator.clipboard.writeText(md);
                  } catch {
                    const ta = document.createElement("textarea");
                    ta.value = md;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand("copy");
                    document.body.removeChild(ta);
                  }
                  setCopiedText(true);
                  setTimeout(() => setCopiedText(false), 2000);
                } catch {
                } finally {
                  setCopying(false);
                }
              }}
              disabled={copying}
              className="text-xs text-gray-400 hover:text-blue-500 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              {copying ? "..." : copiedText ? "✓" : "📋 设定复制"}
            </button>
            <button
              onClick={handleExportMarkdown}
              disabled={exporting}
              className="text-xs text-gray-400 hover:text-blue-500 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              {exporting ? "..." : "📥 设定导出"}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-8">
          <div className="group/img flex-shrink-0 relative">
            {character.image_path ? (
              <img
                src={character.image_path}
                alt=""
                className="w-28 h-28 rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover/img:scale-[1.05]"
              />
            ) : (
              <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-lg shadow-purple-200 transition-transform duration-300 group-hover/img:scale-[1.05]">
                {displayName[0]}
              </div>
            )}
            {/* 浏览量角标 */}
            <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 text-[10px] bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 flex items-center gap-0.5">
              🔥{" "}
              {(character.view_count ?? 0) > 999
                ? `${((character.view_count ?? 0) / 1000).toFixed(1)}k`
                : (character.view_count ?? 0)}
            </span>
          </div>

          <div className="flex-1 min-w-0 self-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {displayName}
            </h1>
            {cd?.anchor?.essence && (
              <p className="text-gray-500 mb-3 line-clamp-2">
                {cd.anchor.essence}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span
                className={`px-2.5 py-1 text-xs rounded-full border ${character.is_public ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-gray-400 border-gray-200 bg-gray-50"}`}
              >
                {character.is_public ? "🌐 公开" : "🔒 私有"}
              </span>
              {character.tags.length > 0 && (
                <span className="w-px h-4 bg-gray-200 mx-1" />
              )}
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
            </div>

            {/* Fork 来源 + Fork 链 */}
            <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {copiedId ? "✓ 已复制" : "复制 ID"}
              </button>
              <span className="text-gray-200">·</span>
              {character.fork_from ? (
                <span>
                  Fork{" "}
                  <Link
                    to={`/characters/${character.fork_from}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    原始角色
                  </Link>
                </span>
              ) : (
                <span className="text-gray-300">原始角色</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {mainTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 角色信息 */}
      {activeTab === "info" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {layerTabs.map(({ key, label, icon, color }) => (
              <button
                key={key}
                onClick={() => setActiveLayer(key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border text-center ${activeLayer === key ? color + " shadow-sm" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
              >
                <span className="block text-lg mb-0.5">{icon}</span>
                <span className="text-xs">{label}</span>
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

      {/* 关系 */}
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

      {/* 传记 */}
      {activeTab === "stories" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">人物传记</h2>
            <Button size="sm" onClick={() => setIsCreateStoryOpen(true)}>
              + 新建篇章
            </Button>
          </div>
          <StoryList />
        </div>
      )}

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

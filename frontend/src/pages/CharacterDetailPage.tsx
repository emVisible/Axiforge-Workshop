import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  useCharacter,
  useDeleteCharacter,
  useForkCharacter,
} from "@/hooks/useCharacters";
import { characterApi } from "@/api/characters";
import { LoadingSpinner, ErrorDisplay } from "@/components/ui";
import { ForkDialog, ForkChain } from "@/components/characters";
import type { PreviewResponse } from "@/types/character";

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: character, isLoading, error } = useCharacter(id!);
  const deleteCharacter = useDeleteCharacter();
  const forkCharacter = useForkCharacter();

  const [isForkDialogOpen, setIsForkDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [previewResponse, setPreviewResponse] =
    useState<PreviewResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "preview">("info");

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorDisplay
        message="加载角色失败"
        onRetry={() => window.location.reload()}
      />
    );
  if (!character) return <ErrorDisplay message="角色不存在" />;

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

  const handlePreview = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      const response = await characterApi.preview(character.id, message);
      setPreviewResponse(response);
      setMessage("");
    } catch (err) {
      console.error("预览失败:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Fork 对话框 */}
      <ForkDialog
        character={character}
        isOpen={isForkDialogOpen}
        onClose={() => setIsForkDialogOpen(false)}
        onFork={handleFork}
        isForking={forkCharacter.isPending}
      />

      {/* 顶部导航 */}
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:text-blue-700 text-sm">
          ← 返回大厅
        </Link>
      </div>

      {/* Fork 链 */}
      <div className="mb-6">
        <ForkChain characterId={character.id} />
      </div>

      {/* 角色头部信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {character.character_data.core.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {character.name || character.character_data.core.name}
              </h1>
              <p className="text-gray-500 mt-1">
                {character.character_data.core.archetype}
              </p>
              <div className="flex gap-2 mt-2">
                {character.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/characters/${character.id}/edit`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              编辑
            </Link>
            <button
              onClick={() => setIsForkDialogOpen(true)}
              className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
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
              Fork
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              删除
            </button>
          </div>
        </div>

        {/* Fork 来源 */}
        {character.fork_from && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
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
              Fork 自
              <Link
                to={`/characters/${character.fork_from}`}
                className="text-blue-500 hover:text-blue-700"
              >
                原始角色
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 标签切换 */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("info")}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === "info"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          角色信息
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === "preview"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          对话预览
        </button>
      </div>

      {/* 角色信息 - 与之前相同 */}
      {activeTab === "info" && (
        <div className="space-y-6">
          {/* 核心设定 */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">核心设定</h2>
            <dl className="space-y-4">
              {Object.entries(character.character_data.core).map(
                ([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-500 capitalize">
                      {key === "name"
                        ? "角色名"
                        : key === "archetype"
                          ? "本质概括"
                          : key === "voice"
                            ? "说话风格"
                            : key === "core_memory"
                              ? "关键记忆"
                              : key === "desire"
                                ? "深层欲望"
                                : key === "fear"
                                  ? "核心恐惧"
                                  : key}
                    </dt>
                    <dd className="mt-1 text-gray-900">{value || "未设定"}</dd>
                  </div>
                ),
              )}
            </dl>
          </section>

          {/* 人格层次 */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">人格层次</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">表层人格</h3>
                <p className="mt-1 text-gray-900">
                  {character.character_data.layers.surface || "未设定"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">真实自我</h3>
                <p className="mt-1 text-gray-900">
                  {character.character_data.layers.intimate || "未设定"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">压力模式</h3>
                <p className="mt-1 text-gray-900">
                  {character.character_data.layers.under_stress || "未设定"}
                </p>
              </div>
            </div>
          </section>

          {/* 动态系统 */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">动态系统</h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                情感触发器
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(
                  character.character_data.dynamics.emotional_triggers,
                ).map(([emotion, triggers]) => (
                  <div key={emotion} className="border rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2">{emotion}</h4>
                    <div className="flex flex-wrap gap-1">
                      {triggers.length > 0 ? (
                        triggers.map((trigger: any, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                          >
                            {trigger}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">未设定</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">成长轨迹</h3>
              <p className="mt-1 text-gray-900">
                {character.character_data.dynamics.growth_arc || "未设定"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">人际模式</h3>
              <p className="mt-1 text-gray-900">
                {character.character_data.dynamics.relationship_patterns ||
                  "未设定"}
              </p>
            </div>
          </section>
        </div>
      )}

      {/* 对话预览 - 与之前相同 */}
      {activeTab === "preview" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">对话预览</h2>
          <p className="text-sm text-gray-500 mb-4">
            测试与角色的对话交互（当前为 Mock 模式）
          </p>

          {previewResponse && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <div className="text-right">
                <div className="inline-block bg-blue-500 text-white rounded-lg px-4 py-2 max-w-md">
                  {previewResponse.user_message}
                </div>
              </div>
              <div className="text-left">
                <div className="inline-block bg-white border border-gray-200 rounded-lg px-4 py-2 max-w-md">
                  <p className="text-sm text-gray-500 mb-1">
                    {previewResponse.character_name}
                  </p>
                  <p>{previewResponse.response}</p>
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
              placeholder="输入消息测试角色..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSending}
            />
            <button
              onClick={handlePreview}
              disabled={isSending || !message.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? "发送中..." : "发送"}
            </button>
          </div>
        </div>
      )}

      {/* 元数据 */}
      <div className="mt-6 text-sm text-gray-400 flex justify-between">
        <span>创建时间: {new Date(character.created_at).toLocaleString()}</span>
        <span>更新时间: {new Date(character.updated_at).toLocaleString()}</span>
      </div>
    </div>
  );
}

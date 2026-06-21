import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useCharacter, useUpdateCharacter } from "@/hooks/useCharacters";
import { useEditorStore, useUIStore } from "@/stores";
import CoreEditor from "@/components/characters/CoreEditor";
import LayersEditor from "@/components/characters/LayersEditor";
import DynamicsEditor from "@/components/characters/DynamicsEditor";
import { LoadingSpinner, ErrorDisplay } from "@/components/ui";
import type { EditorPanel } from "@/stores/uiStore";

const tabs: { key: EditorPanel; label: string; description: string }[] = [
  { key: "core", label: "核心设定", description: "定义角色的本质特征" },
  { key: "layers", label: "人格层次", description: "不同情境下的表现" },
  { key: "dynamics", label: "动态系统", description: "情感触发与成长" },
];

export default function EditCharacterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: character, isLoading, error } = useCharacter(id!);
  const updateCharacter = useUpdateCharacter();
  const { draft, isDirty, setDraft, markClean } = useEditorStore();
  const { activePanel, setActivePanel } = useUIStore();

  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (character) {
      setDraft(character.character_data, character.id);
      setName(character.name || character.character_data.core.name);
      setTags(character.tags);
      setIsPublic(character.is_public);
    }
  }, [character]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message="加载角色失败" />;
  if (!character || !draft) return <ErrorDisplay message="角色不存在" />;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setSaveError("请填写角色名称");
      return;
    }

    try {
      setSaveError(null);
      await updateCharacter.mutateAsync({
        id: character.id,
        data: {
          name: name.trim(),
          character_data: draft,
          is_public: isPublic,
          tags,
        },
      });
      markClean();
      navigate(`/characters/${character.id}`);
    } catch (err) {
      setSaveError("保存失败，请检查后端服务");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/characters/${character.id}`}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          ← 返回角色详情
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">编辑角色</h1>
        <p className="mt-2 text-gray-600">
          修改 {character.character_data.core.name} 的设定
        </p>
      </div>

      {/* 基本信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">基本信息</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              角色名称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                placeholder="输入标签后按回车"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(index)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              公开到角色大厅
            </label>
          </div>
        </div>
      </div>

      {/* 编辑器 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
          {tabs.map(({ key, label, description }) => (
            <button
              key={key}
              onClick={() => setActivePanel(key)}
              className={`flex-1 px-4 py-3 rounded-lg text-left transition-all ${
                activePanel === key
                  ? "bg-blue-50 border-2 border-blue-500"
                  : "border-2 border-transparent hover:bg-gray-50"
              }`}
            >
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-gray-500 mt-1">{description}</div>
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activePanel === "core" && <CoreEditor />}
          {activePanel === "layers" && <LayersEditor />}
          {activePanel === "dynamics" && <DynamicsEditor />}
        </div>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-sm text-gray-500">
          {isDirty && <span className="text-orange-500">● 有未保存的更改</span>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/characters/${character.id}`)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={updateCharacter.isPending}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {updateCharacter.isPending ? "保存中..." : "保存更改"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {saveError}
        </div>
      )}
    </div>
  );
}

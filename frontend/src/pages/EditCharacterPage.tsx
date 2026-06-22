import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useCharacter, useUpdateCharacter } from "@/hooks/useCharacters";
import { useEditorStore } from "@/stores";
import { CharacterEditor } from "@/components/characters";
import {
  LoadingSpinner,
  ErrorDisplay,
  Input,
  Badge,
  Button,
} from "@/components/ui";

export default function EditCharacterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: character, isLoading, error } = useCharacter(id!);
  const updateCharacter = useUpdateCharacter();
  const { draft, isDirty, setDraft, markClean } = useEditorStore();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (character) {
      setDraft(character.character_data, character.id);
      setTags(character.tags.map((t) => t.name));
      setIsPublic(character.is_public);
    }
  }, [character]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message="加载角色失败" />;
  if (!character || !draft) return <ErrorDisplay message="角色不存在" />;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleSave = async () => {
    try {
      setSaveError(null);
      await updateCharacter.mutateAsync({
        id: character.id,
        data: { character_data: draft, is_public: isPublic, tag_names: tags },
      });
      markClean();
      navigate(`/characters/${character.id}`);
    } catch (err) {
      setSaveError("保存失败");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <nav className="mb-6">
        <Link
          to={`/characters/${character.id}`}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 返回角色详情
        </Link>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">编辑角色</h1>
        <p className="mt-2 text-gray-500">修改 {character.name} 的设定</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              标签
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                placeholder="输入标签后按回车"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="blue"
                  onRemove={() => setTags(tags.filter((_, j) => j !== i))}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            公开到角色大厅
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <CharacterEditor />
      </div>

      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="text-sm text-gray-400">
          {isDirty && <span className="text-amber-500">● 有未保存的更改</span>}
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(`/characters/${character.id}`)}
          >
            取消
          </Button>
          <Button onClick={handleSave} loading={updateCharacter.isPending}>
            保存更改
          </Button>
        </div>
      </div>

      {saveError && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {saveError}
        </div>
      )}
    </div>
  );
}

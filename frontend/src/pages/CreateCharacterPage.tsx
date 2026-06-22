import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useEditorStore, emptyCharacterData } from "@/stores";
import { useCreateCharacter } from "@/hooks/useCharacters";
import { CharacterEditor } from "@/components/characters";
import { Badge, Button, Input, DraftIndicator } from "@/components/ui";
import { draftManager, CREATE_DRAFT_ID } from "@/lib/draftManager";
import DraftRestoreDialog from "@/components/ui/DraftRestoreDialog";

export default function CreateCharacterPage() {
  const navigate = useNavigate();
  const { draft, isDirty, setDraft, reset } = useEditorStore();
  const createCharacter = useCreateCharacter();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [ready, setReady] = useState(false);

  // 初始化
  useEffect(() => {
    const saved = draftManager.load(CREATE_DRAFT_ID);
    if (saved && !draft) {
      setShowDraftDialog(true);
    } else if (!draft) {
      setDraft(emptyCharacterData);
    }
    setReady(true);
  }, []);

  const handleRestoreDraft = (draftId: string) => {
    const saved = draftManager.load(draftId);
    if (saved) {
      setDraft(saved);
    }
    setShowDraftDialog(false);
  };

  const handleDiscardDraft = () => {
    draftManager.remove(CREATE_DRAFT_ID);
    setShowDraftDialog(false);
    setDraft(emptyCharacterData);
    setTags([]);
    setIsPublic(false);
  };

  if (showDraftDialog) {
    return (
      <DraftRestoreDialog
        isOpen={true}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
      />
    );
  }

  if (!draft || !ready) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleSave = async () => {
    if (!draft?.anchor?.essence?.trim()) {
      setError("请至少填写锚点中的「本质概括」");
      return;
    }
    if (!draft?.contour?.name?.trim()) {
      setError("请填写角色名称");
      return;
    }

    try {
      setError(null);
      await createCharacter.mutateAsync({
        character_data: draft,
        is_public: isPublic,
        tag_names: tags,
      });
      draftManager.remove(CREATE_DRAFT_ID);
      reset();
      navigate("/my-characters");
    } catch (err) {
      setError("保存失败，请检查后端服务");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">创建角色</h1>
            <p className="mt-2 text-gray-500">
              由表及里，逐层刻画一个立体的角色
            </p>
          </div>
          <DraftIndicator />
        </div>
      </div>

      {/* 标签和公开设置 */}
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

      {/* 六层编辑器（包含角色名称） */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <CharacterEditor />
      </div>

      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <DraftIndicator />
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              draftManager.remove(CREATE_DRAFT_ID);
              reset();
              navigate("/hall");
            }}
          >
            取消
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              draftManager.remove(CREATE_DRAFT_ID);
              setDraft(emptyCharacterData);
              setTags([]);
              setIsPublic(false);
            }}
          >
            重置
          </Button>
          <Button onClick={handleSave} loading={createCharacter.isPending}>
            保存角色
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

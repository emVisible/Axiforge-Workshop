import { useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { Input, Textarea, Badge } from "@/components/ui";

export default function AnchorEditor() {
  const { draft, updateField } = useEditorStore();
  const [tagInput, setTagInput] = useState("");
  if (!draft) return null;

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !draft.anchor.tags.includes(t)) {
      updateField("anchor.tags", [...draft.anchor.tags, t]);
      setTagInput("");
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">
        锚点是角色的核心——名字、本质、标签都在这里。
        <span className="text-red-400">*</span> 为必填
      </p>

      <Input
        label="姓名/称谓"
        required
        value={draft.anchor.name}
        onChange={(e) => updateField("anchor.name", e.target.value)}
        placeholder="角色叫什么 *"
      />

      <Textarea
        label="本质概括"
        required
        value={draft.anchor.essence}
        onChange={(e) => updateField("anchor.essence", e.target.value)}
        placeholder="一句话概括——「用愤怒掩饰悲伤的守护者」*"
        rows={2}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          标签
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
            placeholder="输入标签后按回车"
          />
          <button
            onClick={addTag}
            className="px-4 py-2.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            添加
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {draft.anchor.tags.map((tag, i) => (
            <Badge
              key={i}
              variant="blue"
              onRemove={() => {
                updateField(
                  "anchor.tags",
                  draft.anchor.tags.filter((_, j) => j !== i),
                );
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Input
        label="人生主题"
        value={draft.anchor.theme || ""}
        onChange={(e) => updateField("anchor.theme", e.target.value)}
        placeholder="「救赎」「成长」「反抗命运」"
      />

      <Textarea
        label="核心信念"
        value={draft.anchor.core_belief || ""}
        onChange={(e) => updateField("anchor.core_belief", e.target.value)}
        placeholder="TA不可动摇地相信什么"
        rows={2}
      />
    </div>
  );
}

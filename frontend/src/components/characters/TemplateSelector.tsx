import { characterTemplates, type CharacterTemplate } from "@/lib/presets";
import { useEditorStore } from "@/stores/editorStore";

export default function TemplateSelector() {
  const { setDraft } = useEditorStore();

  const applyTemplate = (template: CharacterTemplate) => {
    const draft = useEditorStore.getState().draft;
    if (!draft) return;

    const newDraft = JSON.parse(JSON.stringify(draft));

    // 批量填充六层数据
    for (const [layerKey, fields] of Object.entries(template.data)) {
      if (newDraft[layerKey]) {
        for (const [fieldKey, value] of Object.entries(fields)) {
          if (newDraft[layerKey][fieldKey] !== undefined) {
            newDraft[layerKey][fieldKey] = value;
          }
        }
      }
    }

    // 设置 name 和 summary
    if (template.data.anchor?.name && newDraft.anchor) {
      newDraft.anchor.name = template.data.anchor.name;
    }

    setDraft(newDraft);
  };

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-400 mb-3">
        从模板开始，快速填充六层设定。之后可以逐层调整。
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {characterTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => applyTemplate(t)}
            className="text-left p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
          >
            <span className="text-xl">{t.icon}</span>
            <h4 className="text-sm font-medium text-gray-700 mt-1 group-hover:text-blue-600">
              {t.name}
            </h4>
            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">
              {t.summary}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

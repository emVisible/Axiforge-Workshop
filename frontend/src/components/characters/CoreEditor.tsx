import { useEditorStore } from '@/stores/editorStore';
import type { CharacterCore } from '@/types/character';

const fields: { key: keyof CharacterCore; label: string; placeholder: string; type: 'input' | 'textarea' }[] = [
  { key: 'name', label: '角色名', placeholder: '角色的名字', type: 'input' },
  { key: 'archetype', label: '本质概括', placeholder: '用一句话概括这个角色的本质，如"陨落的英雄，在悔恨中寻找救赎"', type: 'input' },
  { key: 'voice', label: '说话风格', placeholder: '标志性口头禅或说话方式，如"哼，我才不是关心你呢"', type: 'textarea' },
  { key: 'core_memory', label: '关键记忆', placeholder: '定义了角色人格的关键记忆或事件', type: 'textarea' },
  { key: 'desire', label: '深层欲望', placeholder: '角色最深层的欲望或追求', type: 'textarea' },
  { key: 'fear', label: '核心恐惧', placeholder: '角色最深层的恐惧', type: 'textarea' },
];

export default function CoreEditor() {
  const { draft, updateField } = useEditorStore();

  if (!draft) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">核心设定</h3>
        <p className="text-sm text-gray-500 mb-6">
          定义角色最本质的特征。这些是角色的"灵魂"，不会因情境改变。
        </p>
      </div>

      {fields.map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          {type === 'input' ? (
            <input
              type="text"
              value={draft.core[key]}
              onChange={(e) => updateField(`core.${key}`, e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          ) : (
            <textarea
              value={draft.core[key]}
              onChange={(e) => updateField(`core.${key}`, e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
            />
          )}
        </div>
      ))}
    </div>
  );
}
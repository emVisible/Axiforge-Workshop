import { useEditorStore } from '@/stores/editorStore';
import type { CharacterLayers } from '@/types/character';

const fields: { key: keyof CharacterLayers; label: string; description: string; icon: string }[] = [
  {
    key: 'surface',
    label: '表层人格',
    description: '初次见面时的表现，社交面具或保护色',
    icon: '🎭'
  },
  {
    key: 'intimate',
    label: '真实自我',
    description: '熟悉后展现的真实一面，卸下防备后的样子',
    icon: '💝'
  },
  {
    key: 'under_stress',
    label: '压力模式',
    description: '极端压力下的崩坏或爆发状态',
    icon: '💥'
  },
];

export default function LayersEditor() {
  const { draft, updateField } = useEditorStore();

  if (!draft) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">人格层次</h3>
        <p className="text-sm text-gray-500 mb-6">
          角色在不同情境下展现的不同面向。从外到内，层层深入。
        </p>
      </div>

      {fields.map(({ key, label, description, icon }) => (
        <div key={key} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h4 className="font-medium text-gray-900">{label}</h4>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <textarea
            value={draft.layers[key]}
            onChange={(e) => updateField(`layers.${key}`, e.target.value)}
            placeholder={`描述角色${label}的具体表现...`}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
          />
        </div>
      ))}
    </div>
  );
}
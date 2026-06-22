import { useEditorStore } from '@/stores/editorStore';
import { Textarea } from '@/components/ui';
import type { Psyche } from '@/types/character';

const fields: { key: keyof Psyche; label: string; placeholder: string }[] = [
  { key: 'desire', label: '深层欲望', placeholder: 'TA真正想要的是什么——可能连自己都没完全意识到' },
  { key: 'fear', label: '核心恐惧', placeholder: '最害怕发生的事情或状态' },
  { key: 'conflict', label: '内在矛盾', placeholder: '什么让TA纠结——两种不可调和的需求或信念' },
  { key: 'self_perception', label: '自我认知', placeholder: 'TA眼中的自己 vs 真实的自己' },
];

export default function PsycheEditor() {
  const { draft, updateField } = useEditorStore();
  if (!draft) return null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">内心需要深入交往才能触及——不是TA说什么，而是TA为什么这么说。</p>
      {fields.map(({ key, label, placeholder }) => (
        <Textarea
          key={key}
          label={label}
          value={draft.psyche[key] || ''}
          onChange={(e) => updateField(`psyche.${key}`, e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ))}
    </div>
  );
}
import { useEditorStore } from '@/stores/editorStore';
import { Input, Textarea } from '@/components/ui';
import type { Demeanor } from '@/types/character';

const fields: { key: keyof Demeanor; label: string; placeholder: string; type: 'input' | 'textarea' }[] = [
  { key: 'speech_style', label: '说话方式', placeholder: '语气、节奏、口头禅', type: 'input' },
  { key: 'habits', label: '习惯/癖好', placeholder: '下意识的小动作——"紧张时转动戒指"', type: 'input' },
  { key: 'typical_reaction', label: '常见反应', placeholder: '遇到突发事情时的第一反应模式', type: 'textarea' },
  { key: 'expressiveness', label: '情绪外露程度', placeholder: '内敛藏事 ↔ 喜怒形于色', type: 'input' },
];

export default function DemeanorEditor() {
  const { draft, updateField } = useEditorStore();
  if (!draft) return null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">举止需要观察才能了解——相处一段时间后能注意到的行为模式。</p>
      {fields.map(({ key, label, placeholder, type }) =>
        type === 'input' ? (
          <Input
            key={key}
            label={label}
            value={draft.demeanor[key] || ''}
            onChange={(e) => updateField(`demeanor.${key}`, e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <Textarea
            key={key}
            label={label}
            value={draft.demeanor[key] || ''}
            onChange={(e) => updateField(`demeanor.${key}`, e.target.value)}
            placeholder={placeholder}
            rows={3}
          />
        )
      )}
    </div>
  );
}
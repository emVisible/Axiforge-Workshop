import { useEditorStore } from '@/stores/editorStore';
import { Input, Textarea } from '@/components/ui';
import type { Bond } from '@/types/character';

const fields: { key: keyof Bond; label: string; placeholder: string; type: 'input' | 'textarea' }[] = [
  { key: 'attitude_to_others', label: '对他人的基本态度', placeholder: '开放信任 ↔ 防备疏离', type: 'input' },
  { key: 'intimate_pattern', label: '亲密关系模式', placeholder: '在亲密关系中如何表现', type: 'textarea' },
  { key: 'hostile_pattern', label: '敌对关系模式', placeholder: '面对冲突时的典型策略', type: 'textarea' },
  { key: 'group_role', label: '群体中的角色', placeholder: '领袖、独狼、粘合剂', type: 'input' },
];

export default function BondEditor() {
  const { draft, updateField } = useEditorStore();
  if (!draft) return null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">羁绊定义了角色与他人连接的方式——没有人是孤岛。</p>
      {fields.map(({ key, label, placeholder, type }) =>
        type === 'input' ? (
          <Input
            key={key}
            label={label}
            value={draft.bond[key] || ''}
            onChange={(e) => updateField(`bond.${key}`, e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <Textarea
            key={key}
            label={label}
            value={draft.bond[key] || ''}
            onChange={(e) => updateField(`bond.${key}`, e.target.value)}
            placeholder={placeholder}
            rows={3}
          />
        )
      )}
    </div>
  );
}
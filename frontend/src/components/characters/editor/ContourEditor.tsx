import { useEditorStore } from '@/stores/editorStore';
import { Input, Textarea } from '@/components/ui';
import type { Contour } from '@/types/character';

const fields: { key: keyof Contour; label: string; placeholder: string; type: 'input' | 'textarea' }[] = [
  { key: 'name', label: '姓名/称谓', placeholder: '角色叫什么', type: 'input' },
  { key: 'appearance', label: '外貌特征', placeholder: '一眼可见的外表——发色、瞳色、体型', type: 'input' },
  { key: 'age_era', label: '年龄/时代', placeholder: '如"17岁高中生"或"维多利亚时代的商人"', type: 'input' },
  { key: 'identity', label: '身份/职业', placeholder: '社会角色或职业标签', type: 'input' },
  { key: 'first_impression', label: '第一印象', placeholder: '陌生人见到TA的第一感觉', type: 'textarea' },
];

export default function ContourEditor() {
  const { draft, updateField } = useEditorStore();
  if (!draft) return null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">轮廓是角色最外层的信息——任何人都能一眼看到的。</p>
      {fields.map(({ key, label, placeholder, type }) =>
        type === 'input' ? (
          <Input
            key={key}
            label={label}
            value={draft.contour[key] || ''}
            onChange={(e) => updateField(`contour.${key}`, e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <Textarea
            key={key}
            label={label}
            value={draft.contour[key] || ''}
            onChange={(e) => updateField(`contour.${key}`, e.target.value)}
            placeholder={placeholder}
            rows={2}
          />
        )
      )}
    </div>
  );
}
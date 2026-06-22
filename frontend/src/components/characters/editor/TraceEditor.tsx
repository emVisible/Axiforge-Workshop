import { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Input, Textarea, Badge } from '@/components/ui';

export default function TraceEditor() {
  const { draft, updateField } = useEditorStore();
  const [newEvent, setNewEvent] = useState('');
  if (!draft) return null;

  const addEvent = () => {
    const trimmed = newEvent.trim();
    if (!trimmed) return;
    updateField('trace.key_events', [...draft.trace.key_events, trimmed]);
    setNewEvent('');
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">轨迹解释了"为什么TA会变成这样"——角色的历史塑造了现在。</p>

      <Textarea
        label="出身背景"
        value={draft.trace.background || ''}
        onChange={(e) => updateField('trace.background', e.target.value)}
        placeholder="家庭、阶层、成长环境"
        rows={2}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">关键事件</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {draft.trace.key_events.map((event, i) => (
            <Badge key={i} variant="amber" onRemove={() => {
              updateField('trace.key_events', draft.trace.key_events.filter((_, j) => j !== i));
            }}>{event}</Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEvent())}
            placeholder="添加关键事件"
          />
          <button onClick={addEvent}
            className="px-4 py-2.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0">
            添加
          </button>
        </div>
      </div>

      <Textarea
        label="转折点"
        value={draft.trace.turning_point || ''}
        onChange={(e) => updateField('trace.turning_point', e.target.value)}
        placeholder="什么事件或时刻让TA变成了现在的TA"
        rows={2}
      />
    </div>
  );
}
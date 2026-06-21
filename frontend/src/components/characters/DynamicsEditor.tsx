import { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';

const emotions = [
  { key: '喜悦' as const, label: '喜悦', icon: '😊', color: 'border-yellow-300 bg-yellow-50' },
  { key: '愤怒' as const, label: '愤怒', icon: '😠', color: 'border-red-300 bg-red-50' },
  { key: '悲伤' as const, label: '悲伤', icon: '😢', color: 'border-blue-300 bg-blue-50' },
];

export default function DynamicsEditor() {
  const { draft, updateField, addEmotionTrigger, removeEmotionTrigger } = useEditorStore();
  const [newTriggers, setNewTriggers] = useState<Record<string, string>>({});

  if (!draft) return null;

  const handleAddTrigger = (emotion: '喜悦' | '愤怒' | '悲伤') => {
    const trigger = newTriggers[emotion]?.trim();
    if (trigger) {
      addEmotionTrigger(emotion, trigger);
      setNewTriggers({ ...newTriggers, [emotion]: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">动态系统</h3>
        <p className="text-sm text-gray-500 mb-6">
          定义角色的情感触发器和成长轨迹。这些让角色"活"起来。
        </p>
      </div>

      {/* 情感触发器 */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-4">情感触发器</h4>
        <div className="space-y-4">
          {emotions.map(({ key, label, icon, color }) => (
            <div key={key} className={`border rounded-lg p-5 ${color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{icon}</span>
                <h5 className="font-medium">{label}</h5>
              </div>

              {/* 已有的触发器 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {draft.dynamics.emotional_triggers[key].map((trigger, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm border"
                  >
                    {trigger}
                    <button
                      onClick={() => removeEmotionTrigger(key, index)}
                      className="text-gray-400 hover:text-red-500 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* 添加新触发器 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTriggers[key] || ''}
                  onChange={(e) => setNewTriggers({ ...newTriggers, [key]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTrigger(key)}
                  placeholder={`添加${label}触发器...`}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleAddTrigger(key)}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  添加
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 成长轨迹 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          成长轨迹
        </label>
        <textarea
          value={draft.dynamics.growth_arc}
          onChange={(e) => updateField('dynamics.growth_arc', e.target.value)}
          placeholder="描述角色可能的成长方向或变化..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
        />
      </div>

      {/* 人际模式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          人际模式
        </label>
        <textarea
          value={draft.dynamics.relationship_patterns}
          onChange={(e) => updateField('dynamics.relationship_patterns', e.target.value)}
          placeholder="描述角色与他人相处时的典型模式..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
        />
      </div>
    </div>
  );
}
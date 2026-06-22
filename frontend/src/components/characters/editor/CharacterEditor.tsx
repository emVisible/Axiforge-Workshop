import { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import ContourEditor from './ContourEditor';
import DemeanorEditor from './DemeanorEditor';
import PsycheEditor from './PsycheEditor';
import AnchorEditor from './AnchorEditor';
import TraceEditor from './TraceEditor';
import BondEditor from './BondEditor';

interface LayerConfig {
  key: string;
  label: string;
  icon: string;
  description: string;
  distance: string;
  color: string;
  component: React.ComponentType;
}

const layers: LayerConfig[] = [
  { key: 'anchor', label: '锚点', icon: '⚓', description: '内核·定义性', distance: '核心',
    color: 'border-purple-300 bg-purple-50', component: AnchorEditor },
  { key: 'contour', label: '轮廓', icon: '👤', description: '表象·可见', distance: '外层',
    color: 'border-blue-300 bg-blue-50', component: ContourEditor },
  { key: 'demeanor', label: '举止', icon: '🎭', description: '行为·可观察', distance: '外层',
    color: 'border-cyan-300 bg-cyan-50', component: DemeanorEditor },
  { key: 'psyche', label: '内心', icon: '🧠', description: '心理·需深入', distance: '中层',
    color: 'border-rose-300 bg-rose-50', component: PsycheEditor },
  { key: 'trace', label: '轨迹', icon: '📜', description: '历史·塑造', distance: '中层',
    color: 'border-amber-300 bg-amber-50', component: TraceEditor },
  { key: 'bond', label: '羁绊', icon: '🔗', description: '关系·连接', distance: '外层',
    color: 'border-emerald-300 bg-emerald-50', component: BondEditor },
];

export default function CharacterEditor() {
  const { draft } = useEditorStore();
  const [expandedLayer, setExpandedLayer] = useState<string | null>('anchor');
  if (!draft) return null;

  const getFillProgress = (layer: LayerConfig): number => {
    const data = (draft as any)[layer.key];
    if (!data) return 0;
    const entries = Object.entries(data).filter(([k]) => k !== 'key_events');
    const filled = entries.filter(([_, v]) => {
      if (Array.isArray(v)) return v.length > 0;
      return v !== '' && v !== null && v !== undefined;
    }).length;
    return entries.length > 0 ? Math.round((filled / entries.length) * 100) : 0;
  };

  return (
    <div className="space-y-3">
      {layers.map((layer) => {
        const isExpanded = expandedLayer === layer.key;
        const progress = getFillProgress(layer);
        const LayerComponent = layer.component;

        return (
          <div key={layer.key}
            className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
              isExpanded ? layer.color : 'border-gray-100 hover:border-gray-200'
            }`}>
            <button onClick={() => setExpandedLayer(isExpanded ? null : layer.key)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left">
              <span className="text-xl">{layer.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{layer.label}</span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                    {layer.distance}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{layer.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${
                      progress > 0 ? 'bg-blue-500' : 'bg-transparent'}`}
                      style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{progress}%</span>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {isExpanded && (
              <div className="px-5 pb-5">
                <div className="border-t border-gray-100 pt-5">
                  <LayerComponent />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
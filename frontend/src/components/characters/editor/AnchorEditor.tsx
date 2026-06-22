import { useEditorStore } from '@/stores/editorStore';
import { Input, Textarea } from '@/components/ui';

export default function AnchorEditor() {
  const { draft, updateField } = useEditorStore();
  if (!draft) return null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">锚点是角色的核心——定义了TA是谁、TA的故事在讲什么。本质概括是唯一必填项。</p>

      <Textarea
        label="本质概括"
        required
        value={draft.anchor.essence}
        onChange={(e) => updateField('anchor.essence', e.target.value)}
        placeholder="用一句话概括这个角色的灵魂——「一个用愤怒掩饰悲伤的守护者」"
        rows={2}
      />

      <Input
        label="人生主题"
        value={draft.anchor.theme || ''}
        onChange={(e) => updateField('anchor.theme', e.target.value)}
        placeholder="TA的故事在讲什么——「救赎」「成长」「反抗命运」"
      />

      <Textarea
        label="核心信念"
        value={draft.anchor.core_belief || ''}
        onChange={(e) => updateField('anchor.core_belief', e.target.value)}
        placeholder="TA不可动摇地相信什么——「弱肉强食」或「人性本善」"
        rows={2}
      />
    </div>
  );
}
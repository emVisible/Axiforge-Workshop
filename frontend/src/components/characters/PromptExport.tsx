import { useState } from "react";
import type { CharacterData } from "@/types/character";
import {
  renderCharacterPrompt,
  renderSystemPrompt,
  type PromptFormat,
} from "@/lib/promptRenderer";
import Button from "@/components/ui/Button";

interface PromptExportProps {
  characterData: CharacterData;
  characterName: string;
}

type ExportMode = "system" | "full-plain" | "full-markdown";

export default function PromptExport({
  characterData,
  characterName,
}: PromptExportProps) {
  const [mode, setMode] = useState<ExportMode>("system");
  const [copied, setCopied] = useState(false);

  const getContent = (): string => {
    switch (mode) {
      case "system":
        return renderSystemPrompt(characterData);
      case "full-plain":
        return renderCharacterPrompt(characterData, "plain");
      case "full-markdown":
        return renderCharacterPrompt(characterData, "markdown");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = getContent();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[
          {
            key: "system" as const,
            label: "System Prompt",
            desc: "直接注入LLM",
          },
          { key: "full-plain" as const, label: "完整纯文本", desc: "阅读友好" },
          {
            key: "full-markdown" as const,
            label: "完整 Markdown",
            desc: "文档格式",
          },
        ].map(({ key, label, desc }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 p-3 rounded-xl border-2 text-left transition-all ${
              mode === key
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
          </button>
        ))}
      </div>

      <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
        {content}
      </pre>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{content.split("\n").length} 行</span>
        <Button size="sm" onClick={handleCopy} icon={copied ? "✓" : "📋"}>
          {copied ? "已复制" : "复制"}
        </Button>
      </div>
    </div>
  );
}

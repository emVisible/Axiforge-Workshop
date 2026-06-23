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
  characterId?: string;
  tags?: { name: string }[];
}

type ExportMode = "system" | "full-plain" | "full-markdown" | "json";

export default function PromptExport({
  characterData,
  characterName,
  characterId,
  tags,
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
      case "json":
        return JSON.stringify(
          {
            name: characterName,
            id: characterId,
            tags: tags?.map((t) => t.name) || [],
            character_data: characterData,
          },
          null,
          2,
        );
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getContent();
    const ext =
      mode === "json" ? "json" : mode === "full-markdown" ? "md" : "txt";
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = `${characterName || "character"}.${ext}`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const content = getContent();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "system" as const, label: "System", desc: "注入LLM" },
          { key: "full-plain" as const, label: "纯文本", desc: "阅读" },
          { key: "full-markdown" as const, label: "Markdown", desc: "文档" },
          { key: "json" as const, label: "JSON", desc: "结构化" },
        ].map(({ key, label, desc }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`px-4 py-2 rounded-xl border-2 text-sm transition-all ${
              mode === key
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="font-medium">{label}</span>
            <span className="text-xs text-gray-400 ml-1">{desc}</span>
          </button>
        ))}
      </div>

      <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
        {content}
      </pre>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{content.split("\n").length} 行</span>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleDownload}>
            📥 下载
          </Button>
          <Button size="sm" onClick={handleCopy} icon={copied ? "✓" : "📋"}>
            {copied ? "已复制" : "复制"}
          </Button>
        </div>
      </div>
    </div>
  );
}

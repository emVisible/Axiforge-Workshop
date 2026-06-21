import { useState } from "react";
import type { Character } from "@/types/character";

interface ForkDialogProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onFork: (newName: string) => Promise<void>;
  isForking: boolean;
}

export default function ForkDialog({
  character,
  isOpen,
  onClose,
  onFork,
  isForking,
}: ForkDialogProps) {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await onFork(newName.trim() || `${character.name} (Fork)`);
      setNewName("");
      onClose();
    } catch (err) {
      setError("Fork 失败，请重试");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* 对话框 */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Fork 角色</h3>
            <p className="mt-1 text-sm text-gray-500">
              创建一个基于 "{character.name}" 的副本，你可以自由修改它
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新角色名称
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`${character.name} (Fork)`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-400">
                留空则自动命名为 "{character.name} (Fork)"
              </p>
            </div>

            {/* Fork 预览 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Fork 后将包含：
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ 完整的角色设定（核心、层次、动态）</li>
                <li>✓ 所有标签</li>
                <li>✓ 可自由修改不影响原角色</li>
                <li className="text-gray-400">✗ 默认为私有状态</li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isForking}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isForking}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isForking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Forking...
                  </>
                ) : (
                  "确认 Fork"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

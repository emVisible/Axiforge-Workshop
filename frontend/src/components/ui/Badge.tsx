import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "blue"
  | "amber"
  | "emerald"
  | "rose"
  | "purple";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  onRemove?: () => void;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-600",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-800",
  emerald: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-700",
  purple: "bg-purple-50 text-purple-700",
};

export default function Badge({
  children,
  variant = "default",
  onRemove,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${variantClasses[variant]}`}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:text-red-500 transition-colors ml-0.5"
        >
          ×
        </button>
      )}
    </span>
  );
}

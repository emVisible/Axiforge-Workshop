interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    to: string;
  };
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎭</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {action && (
        <a
          href={action.to}
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
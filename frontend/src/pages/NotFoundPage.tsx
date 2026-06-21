import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔮</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">这个页面被虚空吞噬了</p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        返回大厅
      </Link>
    </div>
  );
}

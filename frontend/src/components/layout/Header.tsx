import { Link, useLocation } from "react-router";
import { APP_NAME } from "@/lib/constants";

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AW</span>
              </div>
              <span className="font-semibold text-gray-900">{APP_NAME}</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/hall"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/hall")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                大厅
              </Link>
              <Link
                to="/create"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/create")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                创建角色
              </Link>
              <Link
                to="/my-characters"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/my-characters")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                我的角色
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              关于
            </Link>
            <div className="text-sm text-gray-300">|</div>
            <div className="text-sm text-gray-400">v0.1.0</div>
          </div>
        </div>
      </div>
    </header>
  );
}

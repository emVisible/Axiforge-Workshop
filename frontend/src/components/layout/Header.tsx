import { Link, useLocation } from "react-router";
import { APP_NAME } from "@/lib/constants";

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-6 ">
            <Link to="/" className="flex items-center gap-2 ">
              <img
                src="/favicon.jpg"
                alt="Axiforge Workshop"
                className="w-8 h-8 rounded-sm shadow-xl  mx-auto "
              />
              <span className="font-semibold text-gray-900 text-sm">
                {APP_NAME}
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                to="/hall"
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive("/hall")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                大厅
              </Link>
              <Link
                to="/create"
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive("/create")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                创建
              </Link>
              <Link
                to="/my-characters"
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive("/my-characters")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                我的
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

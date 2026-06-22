import { Link } from "react-router";

export default function WelcomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero 区域 */}
      <section className="text-center py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <span className="text-white text-4xl font-bold">AW</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Axiforge Workshop
          </h1>
          <p className="text-xl text-gray-600 mb-4">逻辑角色工坊</p>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-3xl mx-auto">
            在这里，角色不是简单的文字描述，而是一个拥有
            <span className="font-semibold text-gray-700">六层结构</span>
            的逻辑实体。由表及里，逐层刻画——从一眼可见的轮廓，到深藏于心的锚点。
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/hall"
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium shadow-lg shadow-blue-200"
            >
              进入大厅
            </Link>
            <Link
              to="/create"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-lg font-medium"
            >
              创建角色
            </Link>
          </div>
        </div>
      </section>

      {/* 六层模型 */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            一个角色，六层深度
          </h2>
          <p className="text-gray-500 text-center mb-12">
            由表及里，层层深入——从第一印象到灵魂内核
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-blue-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">轮廓</h3>
              <p className="text-xs text-blue-500 font-medium mb-2">
                表象 · 可见
              </p>
              <p className="text-sm text-gray-600">
                姓名、外貌、身份——一眼就能看到的信息，角色在人群中的剪影。
              </p>
            </div>

            <div className="bg-white rounded-xl border border-cyan-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">举止</h3>
              <p className="text-xs text-cyan-500 font-medium mb-2">
                行为 · 可观察
              </p>
              <p className="text-sm text-gray-600">
                说话方式、习惯癖好——相处后能注意到的行为模式。
              </p>
            </div>

            <div className="bg-white rounded-xl border border-rose-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">内心</h3>
              <p className="text-xs text-rose-500 font-medium mb-2">
                心理 · 需深入
              </p>
              <p className="text-sm text-gray-600">
                欲望、恐惧、矛盾——不是TA说什么，而是TA为什么这么说。
              </p>
            </div>

            <div className="bg-white rounded-xl border border-purple-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">锚点</h3>
              <p className="text-xs text-purple-500 font-medium mb-2">
                内核 · 定义性
              </p>
              <p className="text-sm text-gray-600">
                本质概括、人生主题——定义了TA是谁、TA的故事在讲什么。
              </p>
            </div>

            <div className="bg-white rounded-xl border border-amber-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📜</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">轨迹</h3>
              <p className="text-xs text-amber-500 font-medium mb-2">
                历史 · 塑造
              </p>
              <p className="text-sm text-gray-600">
                出身、关键事件、转折点——过去如何塑造了现在的TA。
              </p>
            </div>

            <div className="bg-white rounded-xl border border-emerald-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">羁绊</h3>
              <p className="text-xs text-emerald-500 font-medium mb-2">
                关系 · 连接
              </p>
              <p className="text-sm text-gray-600">
                亲密关系模式、群体角色——没有人是孤岛。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 使用流程 */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            如何使用
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  创建角色
                </h3>
                <p className="text-gray-600">
                  从一句话本质概括开始，逐层展开六层结构。每层都是可选的——只填你想填的，深浅由你决定。
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  测试对话
                </h3>
                <p className="text-gray-600">
                  在角色详情页与角色对话，验证设定是否一致。（当前为 Mock 模式）
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  分享 & Fork
                </h3>
                <p className="text-gray-600">
                  公开到大厅，他人可 Fork 进行二次创作，形成角色创作链。
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  导出使用
                </h3>
                <p className="text-gray-600">
                  将角色导出为结构化 Prompt，用于 LLM 应用、VN 引擎等场景。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="py-16 text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            开始创建你的第一个角色
          </h2>
          <p className="text-blue-100 mb-8">
            从一句话开始，逐层深入——每个角色都是一个世界
          </p>
          <Link
            to="/create"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
          >
            立即创建
          </Link>
        </div>
      </section>
    </div>
  );
}

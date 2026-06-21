import { Link } from "react-router";

export default function WelcomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero 区域 */}
      <section className="text-center py-20">
        <div className="max-w-3xl mx-auto">
          {/* Logo/图标 */}
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
            在这里，角色不是简单的文字描述，而是一个拥有核心、层次和动态系统的逻辑实体
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

      {/* 核心理念 */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            一个角色，三个维度
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 核心设定 */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                核心设定
              </h3>
              <p className="text-gray-600 leading-relaxed">
                定义角色的本质特征——名字、原型、说话风格、关键记忆、深层欲望与核心恐惧。
                这是角色的
                <span className="font-medium text-gray-700">灵魂</span>
                ，不会因情境改变。
              </p>
            </div>

            {/* 人格层次 */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                人格层次
              </h3>
              <p className="text-gray-600 leading-relaxed">
                角色在不同情境下的表现——社交面具下的
                <span className="font-medium text-gray-700">表层人格</span>、
                卸下防备后的
                <span className="font-medium text-gray-700">真实自我</span>、
                以及压力之下的
                <span className="font-medium text-gray-700">崩坏模式</span>。
              </p>
            </div>

            {/* 动态系统 */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                动态系统
              </h3>
              <p className="text-gray-600 leading-relaxed">
                情感触发器让角色"活"起来——什么让TA
                <span className="font-medium text-gray-700">喜悦</span>、
                <span className="font-medium text-gray-700">愤怒</span>、
                <span className="font-medium text-gray-700">悲伤</span>？
                角色的成长轨迹和人际模式如何演变？
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
                  填写角色的核心设定、人格层次和动态系统。越详细的描述，角色越立体。
                  可以在三个面板之间自由切换，逐步完善每一个维度。
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
                  在角色详情页使用对话预览功能，与角色进行交互测试。
                  看看TA是否按照你设定的方式回应。（当前为 Mock 模式，未来将接入
                  AI）
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
                  将角色公开到大厅供他人使用。其他用户可以 Fork 你的角色，
                  在保留原始设定的基础上进行二次创作，形成角色创作链。
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  集成到应用
                </h3>
                <p className="text-gray-600">
                  复制角色的结构化 Prompt，用于 LLM 应用、VN 引擎、 AI
                  角色扮演等场景。角色卡是标准化的，可以直接作为 System Prompt
                  使用。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 未来规划 */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">未来规划</h2>
          <p className="text-gray-500 leading-relaxed">
            Workshop 是
            <span className="font-medium text-gray-700"> Axiforge 生态</span>
            的核心模块之一。 未来将深度集成 AI 对话引擎、视觉小说创作框架，
            并支持 ACG 角色模板和社区创作生态。
          </p>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="py-16 text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            开始创建你的第一个角色
          </h2>
          <p className="text-blue-100 mb-8">
            每个角色都是一个世界，等待被定义和探索
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

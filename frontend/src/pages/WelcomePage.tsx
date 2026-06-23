import { useEffect, useRef } from "react";
import { Link } from "react-router";

// ── 全局粒子动效 ──
function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    }[] = [];
    const COUNT = 80;

    const resize = () => {
      w = window.innerWidth;
      h = document.documentElement.scrollHeight;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 160)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

export default function WelcomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleCanvas(canvasRef);

  return (
    <div className="relative">
      {/* 全页面粒子背景 */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* 内容层 */}
      <div className="relative z-10">
        {/* ── Hero ── */}
        <section className="text-center pt-24 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-200">
              <span className="text-white text-3xl font-bold">AW</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Axiforge Workshop
            </h1>
            <p className="text-xl text-gray-500 mb-3">结构化角色创建工具</p>
            <p className="text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto">
              用六层结构描述任何角色——从外貌到内核，从行为到羁绊。 导出为 Prompt
              直接用于 LLM，或分享到社区供他人使用。
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/hall"
                className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-lg font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 active:scale-95"
              >
                浏览大厅
              </Link>
              <Link
                to="/create"
                className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-lg font-medium hover:scale-105 active:scale-95"
              >
                创建角色
              </Link>
            </div>
          </div>
        </section>

        {/* ── 六层结构 ── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              一个角色，六层结构
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm">
              由表及里，填你想填的
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/70 backdrop-blur-sm border border-purple-200/60 rounded-2xl p-5 flex gap-4 items-start hover:bg-white hover:shadow-md transition-all">
                <div className="text-3xl flex-shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  ⚓
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">锚点</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    姓名、本质概括、标签、人生主题、核心信念。角色的灵魂所在。
                  </p>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-blue-200/60 rounded-2xl p-5 flex gap-4 items-start hover:bg-white hover:shadow-md transition-all">
                <div className="text-3xl flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">轮廓</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    外貌特征、年龄、身份、第一印象。一眼可见的信息。
                  </p>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-cyan-200/60 rounded-2xl p-5 flex gap-4 items-start hover:bg-white hover:shadow-md transition-all">
                <div className="text-3xl flex-shrink-0 w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center">
                  🎭
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">举止</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    说话方式、习惯癖好、常见反应。相处后才能了解。
                  </p>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-rose-200/60 rounded-2xl p-5 flex gap-4 items-start hover:bg-white hover:shadow-md transition-all">
                <div className="text-3xl flex-shrink-0 w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
                  🧠
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">内心</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    深层欲望、核心恐惧、内在矛盾、自我认知。
                  </p>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-amber-200/60 rounded-2xl p-5 flex gap-4 items-start hover:bg-white hover:shadow-md transition-all">
                <div className="text-3xl flex-shrink-0 w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  📜
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">轨迹</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    出身背景、关键事件、转折点。过去塑造现在。
                  </p>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-emerald-200/60 rounded-2xl p-5 flex gap-4 items-start hover:bg-white hover:shadow-md transition-all">
                <div className="text-3xl flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  🔗
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">羁绊</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    对他人的态度、亲密关系、群体角色。没有人是孤岛。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 功能亮点 ── */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              不只是创建，更能使用
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm">
              从创建到导出，完整的工作流
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  📤
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  导出 Prompt
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  一键导出为 System Prompt、Markdown 或 JSON，直接粘贴到 LLM
                  对话窗口使用。
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  🕸️
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  关系图谱
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  定义角色间的师徒、宿敌、挚友关系，中世纪手稿风格可视化呈现，支持导出
                  PNG。
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  🕰️
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  版本历史
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  每次编辑自动保存版本，随时回滚到任意历史状态，放心迭代角色设定。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 使用步骤 ── */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              三步开始
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm">
              不需要填完所有字段，从一句话就够了
            </p>

            <div className="space-y-6">
              <div className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    写一句话
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    在锚点中写下角色的本质概括——"一个用愤怒掩饰悲伤的守护者"。
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    逐层展开
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    想写多少写多少——轮廓、举止、内心……每层都是可选的，深浅由你。
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    导出使用
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    复制 Prompt 粘贴到 ChatGPT 等 LLM 中，角色就"活"了。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 底部 CTA ── */}
        <section className="pb-20 text-center">
          <div className="max-w-xl mx-auto">
            <p className="text-gray-400 text-sm mb-6">
              从一句话开始，逐层深入。深浅由你决定。
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-10 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all text-lg font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 active:scale-95"
            >
              创建第一个角色
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

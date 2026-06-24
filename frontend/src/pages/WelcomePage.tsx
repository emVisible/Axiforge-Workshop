import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui";

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
        ctx.fillStyle = `rgba(59,52,115,${p.alpha})`;
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
            ctx.strokeStyle = `rgba(59,52,115,${0.1 * (1 - dist / 160)})`;
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
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Hero */}
        <section className="text-center pt-24 pb-16">
          <div className="max-w-2xl mx-auto">
            <img
              src="/favicon.jpg"
              alt="Axiforge Workshop"
              className="w-20 h-20 rounded-2xl shadow-lg shadow-[#3b3473]/15 mx-auto mb-6"
            />
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Axiforge Workshop
            </h1>
            <p className="text-xl text-gray-500 mb-3">结构化角色创建工具</p>
            <p className="text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto">
              用六层结构描述任何角色——从外貌到内核，从行为到羁绊。 导出为 Prompt
              直接用于 LLM，或分享到社区供他人使用。
            </p>
            <div className="flex gap-4 justify-center">
              <Button as="link" to="/hall" size="lg">
                浏览大厅
              </Button>
              <Button as="link" to="/create" variant="secondary" size="lg">
                创建角色
              </Button>
            </div>
          </div>
        </section>

        {/* 六层结构 */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              一个角色，六层结构
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm">
              由表及里，填你想填的
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "⚓",
                  title: "锚点",
                  desc: "姓名、概括、描述、标签。角色的灵魂所在。",
                  border: "border-purple-200/60",
                  bg: "bg-purple-50",
                },
                {
                  icon: "👤",
                  title: "轮廓",
                  desc: "外貌、年龄、身份、第一印象。一眼可见。",
                  border: "border-blue-200/60",
                  bg: "bg-blue-50",
                },
                {
                  icon: "🎭",
                  title: "举止",
                  desc: "说话方式、习惯、常见反应。相处后了解。",
                  border: "border-cyan-200/60",
                  bg: "bg-cyan-50",
                },
                {
                  icon: "🧠",
                  title: "内心",
                  desc: "欲望、恐惧、矛盾、自我认知。",
                  border: "border-rose-200/60",
                  bg: "bg-rose-50",
                },
                {
                  icon: "📜",
                  title: "轨迹",
                  desc: "出身、关键事件、转折点。过去塑造现在。",
                  border: "border-amber-200/60",
                  bg: "bg-amber-50",
                },
                {
                  icon: "🔗",
                  title: "羁绊",
                  desc: "对他人的态度、关系模式。没有人是孤岛。",
                  border: "border-emerald-200/60",
                  bg: "bg-emerald-50",
                },
              ].map(({ icon, title, desc, border, bg }) => (
                <div
                  key={title}
                  className={`bg-white/70 backdrop-blur-sm border ${border} rounded-2xl p-5 flex gap-4 items-start hover:bg-white hover:shadow-md transition-all`}
                >
                  <div
                    className={`text-2xl flex-shrink-0 w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}
                  >
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 功能亮点 */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              不只是创建，更能使用
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm">
              从创建到导出，完整的工作流
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "📤",
                  title: "导出 Markdown",
                  desc: "一键导出角色设定、传记和关系为 Markdown 文件，或复制到剪贴板。",
                },
                {
                  icon: "🕸️",
                  title: "关系图谱",
                  desc: "定义角色间的师徒、宿敌、挚友关系，中世纪手稿风格可视化。",
                },
                {
                  icon: "🕰️",
                  title: "版本历史",
                  desc: "每次编辑自动保存版本，随时回滚到任意历史状态。",
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
                    {icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 使用步骤 */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              三步开始
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm">
              不需要填完所有字段，从一句话就够了
            </p>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "写一句话",
                  desc: "在锚点中写下角色的概括——「傲娇学妹」「陨落的英雄」。",
                },
                {
                  step: "2",
                  title: "逐层展开",
                  desc: "想写多少写多少——轮廓、举止、内心……每层都是可选的，深浅由你。",
                },
                {
                  step: "3",
                  title: "导出使用",
                  desc: "复制 Markdown 粘贴到 ChatGPT 等 LLM 中，角色就「活」了。",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#3b3473]/10 text-[#3b3473] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 底部 */}
        <section className="pb-20 text-center">
          <div className="max-w-xl mx-auto">
            <p className="text-gray-400 text-sm mb-6">
              从一句话开始，逐层深入。深浅由你决定。
            </p>
            <Button as="link" to="/create" size="lg">
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
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

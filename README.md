# Axiforge Workshop

结构化角色创建工具 — 用六层模型描述任何角色，导出为 Prompt 直接用于 LLM。

## 是什么

一个基于六层结构（锚点·轮廓·举止·内心·轨迹·羁绊）的角色定义系统。每个角色不只是一段文字，而是可以被 LLM 理解的结构化数据。

- **创建** — 16 个预设模板或自定义输入，逐层刻画角色
- **连接** — 关系图谱，定义角色间的羁绊
- **书写** — Markdown 传记编辑器，记录角色故事
- **导出** — 一键导出 Markdown，直接粘贴到 LLM 对话

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React · TypeScript · React Router · TanStack Query · Zustand · Tailwind CSS · D3 |
| 后端 | Python · FastAPI · SQLAlchemy · PostgreSQL |
| 工具 | pnpm · uv |

## 快速开始

### 前置

- Python ≥ 3.11
- Node.js ≥ 18
- PostgreSQL ≥ 14
- [uv](https://github.com/astral-sh/uv) · [pnpm](https://pnpm.io)

### 后端

```bash
cd backend
cp .env.example .env
uv sync
uv run uvicorn src.app.main:app --reload --port 8000
```

### 前端

```bash
cd frontend
pnpm install
pnpm dev
```

访问 `http://localhost:5173`

## 项目结构

```
axiforge-workshop/
├── backend/          # FastAPI · SQLAlchemy · PostgreSQL
│   └── src/app/
│       ├── models/      # 数据模型
│       ├── schemas/     # Pydantic 校验
│       ├── routes/      # API 路由
│       └── services/    # 业务逻辑
└── frontend/         # React · TanStack · Tailwind
    └── src/
        ├── components/  # 组件
        ├── pages/       # 页面
        ├── hooks/       # React Query hooks
        ├── stores/      # Zustand 状态
        ├── api/         # API 调用
        └── lib/         # 工具函数
```

## 生态

Workshop 是 **The Grove** 个人数字生态的一部分：

- **Grove** — 元界面入口
- **Pota** — AI 平台层
- **Axiforge** — VN 框架（Workshop 为其提供角色系统）
- **Canopy** — 社区
- **Nexus** — 知识管理

## License

MIT

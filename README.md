# Axiforge Workshop
逻辑角色工坊 — 创建、定义、分享可被 LLM 理解的角色。

## 是什么

一个**结构化角色定义系统**，属于 [Axiforge 生态](https://github.com/your-org/axiforge) 的核心模块。

每个角色不只是一段文字描述，而是一个拥有 **核心设定 · 人格层次 · 动态系统** 三维结构的逻辑实体。当描述足够多时，这些信息可以代表和概括这个角色，直接作为 LLM 的 System Prompt 使用。

## 技术栈

| 层   | 技术                                                                        |
| ---- | --------------------------------------------------------------------------- |
| 前端 | React · TypeScript · React Router · TanStack Query · Zustand · Tailwind CSS |
| 后端 | Python · FastAPI · SQLAlchemy · PostgreSQL                                  |
| 工具 | pnpm · uv                                                                   |

## 快速开始

### 前置要求

- Python ≥ 3.11
- Node.js ≥ 18
- PostgreSQL ≥ 14
- [uv](https://github.com/astral-sh/uv)
- [pnpm](https://pnpm.io)

### 后端

```bash
cd backend
cp .env.example .env
uv sync
uv run uvicorn src.app.main:app --reload --port 8000
```

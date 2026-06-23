from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import character_router
from .routes.tag import router as tag_router
from .routes.relation import router as relation_router
from .routes.version import router as version_router
from .routes.upload import router as upload_router
from .config import settings

from pathlib import Path

app = FastAPI(
    title="Axiforge Workshop",
    description="Character creation and management system",
    version="0.1.0",
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/uploads", StaticFiles(directory=str(Path(settings.upload_dir))), name="uploads"
)
app.include_router(version_router)
app.include_router(character_router)
app.include_router(tag_router)
app.include_router(relation_router)
app.include_router(upload_router)


@app.on_event("startup")
async def startup_event():
    await init_db()


@app.get("/")
async def root():
    return {"name": "Axiforge Workshop API", "version": "0.1.0", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

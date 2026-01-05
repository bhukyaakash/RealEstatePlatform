from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import auth, users, lands, admin, verification
from app.db.init_db import init_db

app = FastAPI(
    title="Real Estate Platform API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(lands.router, prefix="/api/lands", tags=["lands"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(verification.router, prefix="/api/verification", tags=["verification"])

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Real Estate Platform API", "docs": "/api/docs"}

@app.get("/health")
async def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}

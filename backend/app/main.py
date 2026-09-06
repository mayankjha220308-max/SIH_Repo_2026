from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .auth import routes as auth_routes
from .products import routes as product_routes
from .database import Base, engine
import os

app = FastAPI(title="SIH Digital Marketplace - Backend")

# CORS - allow credentials so cookies work during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(product_routes.router)

# Mount static directory for uploaded files
static_dir = os.path.join(os.getcwd(), 'backend', 'static')
if not os.path.exists(static_dir):
    os.makedirs(static_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.on_event("startup")
def startup_event():
    # Create tables for development convenience. Use Alembic for production migrations.
    Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health():
    return {"status": "ok"}

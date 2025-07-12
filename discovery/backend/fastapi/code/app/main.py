from fastapi import FastAPI
from routes.user_route import router as user_router
from prisma import Prisma
import time

db = Prisma()

app = FastAPI()

@app.on_event("startup")
async def startup():
    print("🚀 Starting up...")
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    print("🧹 Shutting down...")
    await db.disconnect()

@app.middleware("http")
async def log_time(request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    print(f"⏱ {request.method} {request.url.path} took {duration:.2f}s")
    return response

app.include_router(user_router, prefix="/users", tags=["Users"])

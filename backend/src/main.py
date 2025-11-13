import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.auth import router as auth_router
from .routes.messages import router as messages
from .routes.webhook import router as webhook_router

logging.basicConfig(level=logging.INFO)


app = FastAPI()
app.include_router(auth_router)
app.include_router(webhook_router)
app.include_router(messages)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://0.0.0.0:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"message": "Hello, MSG Manager!"}

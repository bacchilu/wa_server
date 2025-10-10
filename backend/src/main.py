import logging

from fastapi import FastAPI

from .webhook import router as webhook_router

logging.basicConfig(level=logging.INFO)


app = FastAPI()
app.include_router(webhook_router)


@app.get("/")
async def read_root():
    return {"message": "Hello, MSG Manager!"}

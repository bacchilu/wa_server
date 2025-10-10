import json
import logging
from typing import Any

from fastapi import FastAPI, Request

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()


@app.get("/")
async def read_root():
    return {"message": "Hello, MSG Manager!"}


@app.post("/webhook")
async def webhook(request: Request):
    logger.debug("Message received")
    message: dict[str, Any] = await request.json()
    logger.info("Message JSON :\n%s", json.dumps(message, indent=4))
    return message

import json
import logging
from pprint import pformat
from typing import Any

from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.responses import PlainTextResponse

import wa

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()


@app.get("/hello")
async def read_root():
    return {"Hello": "World"}


@app.get("/", response_class=PlainTextResponse)
def verify_webhook(
    mode: str | None = Query(None, alias="hub.mode"),
    challenge: str | None = Query(None, alias="hub.challenge"),
    token: str | None = Query(None, alias="hub.verify_token"),
):
    verified_challenge = wa.verify_token(mode, token, challenge)
    if verified_challenge is not None:
        logger.info("Webhook verified")
        return verified_challenge
    raise HTTPException(status_code=403)


@app.post("/")
async def webhook(request: Request):
    logger.debug("Webhook received")

    try:
        payload: dict[str, Any] = await request.json()
        logger.info("Webhook JSON payload:\n%s", json.dumps(payload, indent=4))
        logger.info(pformat(wa.parse_notification_payload(payload)))
    except Exception:
        raw = await request.body()
        logger.warning(
            "Webhook payload not valid JSON; raw body: %s",
            raw.decode("utf-8", errors="replace"),
        )
    return Response(status_code=200)


@app.get("/send_message")
async def send_message():
    try:
        data = await wa.send_message()
    except wa.WAError as e:
        raise HTTPException(status_code=500, detail=e.payload)

    return data

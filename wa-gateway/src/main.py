import json
import logging
from pprint import pformat
from typing import Any

import wa
from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.responses import PlainTextResponse
from interactor import MessageReceivedManager, TokenVerifyManager
from pydantic import BaseModel
from utils import GenericError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()


token_verify_manager = TokenVerifyManager()
message_received_manager = MessageReceivedManager()


class SendTextMessagePayload(BaseModel):
    to: str
    body: str


@app.get("/", response_class=PlainTextResponse)
def verify_webhook(
    mode: str | None = Query(None, alias="hub.mode"),
    challenge: str | None = Query(None, alias="hub.challenge"),
    token: str | None = Query(None, alias="hub.verify_token"),
):
    try:
        verified_challenge = token_verify_manager(mode, challenge, token)
        logger.info("Webhook verified")
        return verified_challenge
    except GenericError as exc:
        raise HTTPException(status_code=403, detail=exc.payload)


@app.post("/")
async def webhook(request: Request):
    logger.debug("Webhook received")
    try:
        payload: dict[str, Any] = await request.json()
        logger.info("Webhook JSON payload:\n%s", json.dumps(payload, indent=4))
        data = message_received_manager(payload)
        logger.info(pformat(data))
    except GenericError as exc:
        raise HTTPException(status_code=500, detail=exc.payload)
    return Response(status_code=200)


@app.get("/send_test_message")
async def send_test_message():
    try:
        data = await wa.send_text(
            "+393474846411",
            "Nel mezzo del cammin di nostra vita\nMi ritrovai per una selva oscura\n\nhttps://github.com/bacchilu",
        )
    except GenericError as exc:
        raise HTTPException(status_code=500, detail=exc.payload)
    return data


@app.post("/send_text_message")
async def send_text_message(payload: SendTextMessagePayload):
    try:
        data = await wa.send_text(payload.to, payload.body)
    except GenericError as exc:
        raise HTTPException(status_code=500, detail=exc.payload)
    return data


@app.get("/hello")
async def read_root():
    return {"Hello": "World"}

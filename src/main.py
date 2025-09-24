import logging
import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.responses import PlainTextResponse

load_dotenv()

TOKEN = os.getenv("TOKEN", "TOKEN NOT FOUND")
PHONE_ID = os.getenv("PHONE_ID")
VERIFICATION_TOKEN = os.getenv("VERIFICATION_TOKEN")


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
    if mode == "subscribe" and token == VERIFICATION_TOKEN and challenge is not None:
        logger.info("Webhook verified")
        return challenge
    raise HTTPException(status_code=403)


@app.post("/")
async def webhook(request: Request):
    logger.debug("Webhook received")

    try:
        payload = await request.json()
        logger.info("Webhook JSON payload: %s", payload)
    except Exception:
        raw = await request.body()
        logger.warning(
            "Webhook payload not valid JSON; raw body: %s",
            raw.decode("utf-8", errors="replace"),
        )
    return Response(status_code=200)


@app.get("/send_message")
async def send_message():
    url = f"https://graph.facebook.com/v23.0/{PHONE_ID}/messages"
    message_payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "+393474846411",
        "type": "text",
        "text": {
            "preview_url": True,
            "body": "Nel mezzo del cammin di nostra vita\nMi ritrovai per una selva oscura\n\nhttps://github.com/bacchilu",
        },
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {TOKEN}",
    }
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(url, json=message_payload, headers=headers)

    try:
        data = response.json()
    except ValueError:
        data = {"raw": response.text}

    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=data)

    return data

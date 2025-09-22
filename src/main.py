import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.responses import PlainTextResponse

# from pywa import WhatsApp, types

load_dotenv()

TOKEN = os.getenv("TOKEN", "TOKEN NOT FOUND")
PHONE_ID = os.getenv("PHONE_ID")
APP_SECRET = os.getenv("APP_SECRET")


app = FastAPI()


# wa = WhatsApp(phone_id=PHONE_ID, token=TOKEN)
# wa = WhatsApp(phone_id=PHONE_ID, token=TOKEN, server=app, verify_token="XYZ123")


@app.get("/hello")
async def read_root():
    return {"Hello": "World"}


# @app.post("/send")
# async def send_message(payload: dict):
#     sent_message = wa.send_message(to=payload["to"], text=payload["text"])
#     return {"payload": payload, "message_id": sent_message.id}


@app.get("/", response_class=PlainTextResponse)
def verify_webhook(
    mode: str | None = Query(None, alias="hub.mode"),
    challenge: str | None = Query(None, alias="hub.challenge"),
    token: str | None = Query(None, alias="hub.verify_token"),
):
    if mode == "subscribe" and token == "XYZ123" and challenge is not None:
        print("WEBHOOK VERIFIED")
        return challenge
    raise HTTPException(status_code=403)


@app.post("/")
async def webhook(request: Request):
    print("\n\nWebhook received\n")

    try:
        payload = await request.json()
        print(payload)
    except Exception:
        raw = await request.body()
        print(raw.decode("utf-8", errors="replace"))
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


# @wa.on_message()
# def handle_message(client: WhatsApp, message: types.Message) -> None:
#     if message.type == "text":
#         client.send_message(to=message.from_user.wa_id, text=f"Echo: {message.text}")

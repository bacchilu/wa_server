import os

from dotenv import load_dotenv
from fastapi import FastAPI
from pywa import WhatsApp
# from pywa import types

load_dotenv()

TOKEN = os.getenv("TOKEN", "TOKEN NOT FOUND")
PHONE_ID = os.getenv("PHONE_ID")
APP_SECRET = os.getenv("APP_SECRET")


app = FastAPI()


wa = WhatsApp(phone_id=PHONE_ID, token=TOKEN)
# wa = WhatsApp(phone_id=PHONE_ID, token=TOKEN, server=app, verify_token="XYZ123")


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post("/")
async def send_message(payload: dict):
    sent_message = wa.send_message(to=payload["to"], text=payload["text"])
    return {"payload": payload, "message_id": sent_message.id}


# @wa.on_message
# def handle_message(client: WhatsApp, msg: types.Message):
#     print(msg)

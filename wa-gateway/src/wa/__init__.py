import os
from typing import Any

from dotenv import load_dotenv

from utils import GenericError, post_json

from .messages import WhatsAppMessage

load_dotenv()

VERIFICATION_TOKEN = os.getenv("VERIFICATION_TOKEN")
PHONE_ID = os.getenv("PHONE_ID")
TOKEN = os.getenv("TOKEN", "TOKEN NOT FOUND")


__all__ = ("verify_token", "parse_notification_payload", "send_text", "WhatsAppMessage")


def verify_token(mode: str | None, token: str | None, challenge: str | None):
    if mode == "subscribe" and token == VERIFICATION_TOKEN and challenge is not None:
        return challenge
    raise GenericError(
        "Invalid webhook verification parameters",
        {"mode": mode, "token": token, "challenge": challenge},
    )


def parse_notification_payload(payload: dict[str, Any]) -> list[WhatsAppMessage]:
    try:
        messages: list[WhatsAppMessage] = []
        for entry in payload["entry"]:
            for change in entry["changes"]:
                for message in change["value"]["messages"]:
                    messages.append(WhatsAppMessage.from_payload(message))
        return messages
    except Exception:
        raise GenericError("Invalid notification payload", payload)


async def send_text(to: str, body: str):
    url = f"https://graph.facebook.com/v23.0/{PHONE_ID}/messages"
    message_payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "text",
        "text": {"preview_url": True, "body": body},
    }
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"}

    try:
        return await post_json(url, message_payload, headers=headers)
    except Exception as exc:
        payload = exc.args[0] if exc.args else {"error": "unknown"}
        if not isinstance(payload, dict):
            payload = {"error": str(payload)}
        raise GenericError("Failed to send WhatsApp message", payload)

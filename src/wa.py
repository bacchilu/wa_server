import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from dotenv import load_dotenv

from utils import post_json

load_dotenv()

VERIFICATION_TOKEN = os.getenv("VERIFICATION_TOKEN")
PHONE_ID = os.getenv("PHONE_ID")
TOKEN = os.getenv("TOKEN", "TOKEN NOT FOUND")


__all__ = ("WAError", "verify_token", "parse_notification_payload", "send_text")


class WAError(Exception):
    def __init__(self, payload: dict[str, Any]):
        super().__init__(payload)
        self.payload = dict(payload)

    def __str__(self) -> str:
        return json.dumps(self.payload)


@dataclass(frozen=True, slots=True)
class WhatsAppMessage:
    @classmethod
    def from_payload(cls, message: dict[str, Any]) -> "WhatsAppMessage":
        W = {"text": WhatsAppTextMessage}.get(
            message["type"], WhatsAppUnsupportedMessage
        )
        return W.from_payload(message)


@dataclass(frozen=True, slots=True)
class WhatsAppTextMessage(WhatsAppMessage):
    customer_id: str
    id: str
    timestamp: datetime
    type: str
    body: str

    @classmethod
    def from_payload(cls, message: dict[str, Any]) -> "WhatsAppTextMessage":
        return cls(
            customer_id=message["from"],
            id=message["id"],
            timestamp=datetime.fromtimestamp(
                int(message["timestamp"]), tz=timezone.utc
            ),
            type=message["type"],
            body=message["text"]["body"],
        )


@dataclass(frozen=True, slots=True)
class WhatsAppUnsupportedMessage(WhatsAppMessage):
    raw: dict[str, Any]

    @classmethod
    def from_payload(cls, message: dict[str, Any]) -> "WhatsAppUnsupportedMessage":
        return cls(raw=message)


def verify_token(mode: str | None, token: str | None, challenge: str | None):
    if mode == "subscribe" and token == VERIFICATION_TOKEN and challenge is not None:
        return challenge
    raise WAError(payload={"mode": mode, "token": token, "challenge": challenge})


def parse_notification_payload(payload: dict[str, Any]) -> list[WhatsAppMessage]:
    try:
        messages: list[WhatsAppMessage] = []
        for entry in payload["entry"]:
            for change in entry["changes"]:
                for message in change["value"]["messages"]:
                    messages.append(WhatsAppMessage.from_payload(message))
        return messages
    except Exception:
        raise WAError(payload=payload)


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
        raise WAError(payload=payload)

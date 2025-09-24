import os
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

VERIFICATION_TOKEN = os.getenv("VERIFICATION_TOKEN")


@dataclass(frozen=True, slots=True)
class WhatsAppMessage:
    customer_id: str
    id: str
    timestamp: datetime
    type: str
    body: str

    @classmethod
    def from_payload(cls, message: dict[str, Any]) -> "WhatsAppMessage":
        return cls(
            customer_id=message["from"],
            id=message["id"],
            timestamp=datetime.fromtimestamp(
                int(message["timestamp"]), tz=timezone.utc
            ),
            type=message["type"],
            body=message["text"]["body"],
        )


def verify_token(mode: str | None, token: str | None, challenge: str | None):
    if mode == "subscribe" and token == VERIFICATION_TOKEN and challenge is not None:
        return challenge


def parse_notification_payload(payload: dict[str, Any]) -> list[WhatsAppMessage]:
    messages: list[WhatsAppMessage] = []
    for entry in payload["entry"]:
        for change in entry["changes"]:
            for message in change["value"]["messages"]:
                messages.append(WhatsAppMessage.from_payload(message))
    return messages

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

__all__ = ["WhatsAppMessage", "WhatsAppTextMessage", "WhatsAppUnsupportedMessage"]


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

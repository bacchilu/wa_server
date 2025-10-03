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

    def serialize(self) -> dict[str, Any]:
        raise NotImplementedError


@dataclass(frozen=True, slots=True)
class WhatsAppTextMessage(WhatsAppMessage):
    type = "text"
    customer_id: str
    id: str
    timestamp: datetime
    body: str

    @classmethod
    def from_payload(cls, message: dict[str, Any]) -> "WhatsAppTextMessage":
        return cls(
            customer_id=message["from"],
            id=message["id"],
            timestamp=datetime.fromtimestamp(
                int(message["timestamp"]), tz=timezone.utc
            ),
            body=message["text"]["body"],
        )

    def serialize(self) -> dict[str, Any]:
        return {
            "type": self.type,
            "customer_id": self.customer_id,
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),
            "body": self.body,
        }


@dataclass(frozen=True, slots=True)
class WhatsAppUnsupportedMessage(WhatsAppMessage):
    type = "unsupported"
    raw: dict[str, Any]

    @classmethod
    def from_payload(cls, message: dict[str, Any]) -> "WhatsAppUnsupportedMessage":
        return cls(raw=message)

    def serialize(self) -> dict[str, Any]:
        return {"type": self.type, "raw": self.raw}

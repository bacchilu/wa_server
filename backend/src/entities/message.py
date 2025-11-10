__all__ = ["WebhookMessage", "TextMessage"]


from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Any


@dataclass(frozen=True)
class WebhookMessage:
    timestamp: datetime

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "WebhookMessage":
        if "type" not in payload:
            raise ValueError("Missing message type")
        message_type = payload["type"]
        if not isinstance(message_type, str):
            raise TypeError("Message type must be a string")

        if message_type == "text":
            return TextMessage.from_dict(payload)
        return UnsupportedMessage.from_dict(payload)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class TextMessage(WebhookMessage):
    customer_id: str
    id: str
    body: str

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "TextMessage":
        del payload["type"]
        return cls(**payload)

    def to_dict(self) -> dict[str, Any]:
        return {**asdict(self), "type": "text"}


@dataclass(frozen=True)
class UnsupportedMessage(WebhookMessage):
    raw: dict[str, Any]

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "UnsupportedMessage":
        return cls(raw=payload, timestamp=datetime.now(timezone.utc))

    def to_dict(self) -> dict[str, Any]:
        return {**asdict(self), "type": "unknown"}

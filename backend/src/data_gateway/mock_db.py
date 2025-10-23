__all__ = ["MockDB"]


from datetime import datetime, timedelta, timezone

from ..entities import TextMessage, WebhookMessage
from .types import MessageStore

FAKE_MESSAGES: list[WebhookMessage] = [
    TextMessage(
        customer_id=f"customer-{((index - 1) % 5) + 1:02d}",
        id=f"msg-{index:03d}",
        timestamp=datetime(2024, 1, 1, tzinfo=timezone.utc) + timedelta(minutes=index),
        body=f"Sample text payload #{index}",
    )
    for index in range(1, 11)
]


class MockDB(MessageStore):
    _db: list[WebhookMessage] = FAKE_MESSAGES

    @classmethod
    def push_message(cls, message: WebhookMessage) -> None:
        cls._db.append(message)

    @classmethod
    def get_messages(cls) -> list[WebhookMessage]:
        return cls._db

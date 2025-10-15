__all__ = ["MockDB"]


from ..entities import WebhookMessage
from .types import MessageStore


class MockDB(MessageStore):
    _db: list[WebhookMessage] = []

    @classmethod
    def push_message(cls, message: WebhookMessage) -> None:
        cls._db.append(message)

    @classmethod
    def get_messages(cls) -> list[WebhookMessage]:
        return cls._db

__all__ = ["MessagesService"]


from ..data_gateway import MessageStore
from ..entities import WebhookMessage

DB: list[WebhookMessage] = []


class MessagesService:
    def __init__(self, db: MessageStore):
        self.db = db

    def push(self, dto_message: WebhookMessage):
        self.db.push_message(dto_message)

    def get_messages(self) -> list[WebhookMessage]:
        return self.db.get_messages()

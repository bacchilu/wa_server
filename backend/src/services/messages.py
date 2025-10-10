__all__ = ["MessagesService"]


from ..entities import WebhookMessage


class MessagesService:
    def __init__(self):
        pass

    def push(self, dto_message: WebhookMessage):
        print(dto_message)

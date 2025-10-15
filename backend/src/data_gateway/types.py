__all__ = ["MessageStore"]


from typing import Protocol, runtime_checkable

from ..entities import WebhookMessage


@runtime_checkable
class MessageStore(Protocol):
    @classmethod
    def push_message(cls, message: WebhookMessage) -> None: ...

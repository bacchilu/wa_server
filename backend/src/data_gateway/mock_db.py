__all__ = ["MockDB"]


from datetime import datetime, timedelta, timezone
from random import choice, randint, sample
from uuid import uuid4

from ..entities import TextMessage, WebhookMessage
from .types import MessageStore

_MESSAGE_SNIPPETS = [
    "Follow-up #{index} re: onboarding flow",
    "Customer ping about WhatsApp delivery",
    "QA sync for sprint {index}",
    "Escalation note {index} – awaiting reply",
    "Draft reply for campaign {index}",
]

_LOOKBACK_MINUTES = 30 * 24 * 60


def _generate_fake_messages() -> list[WebhookMessage]:
    now = datetime.now(timezone.utc)
    total_customers = randint(1, 9)
    customer_suffixes = sample(range(10), total_customers)

    messages: list[WebhookMessage] = []
    for suffix in customer_suffixes:
        customer_id = f"customer-{suffix:02d}"
        message_count = randint(1, 10)
        for index in range(1, message_count + 1):
            minutes_back = randint(0, _LOOKBACK_MINUTES)
            timestamp = now - timedelta(minutes=minutes_back)
            body_template = choice(_MESSAGE_SNIPPETS)
            message_id = uuid4().hex[:10]
            messages.append(
                TextMessage(
                    customer_id=customer_id,
                    id=f"{customer_id}-{message_id}",
                    timestamp=timestamp,
                    body=body_template.format(index=index),
                )
            )

    return sorted(messages, key=lambda msg: msg.timestamp)


FAKE_MESSAGES: list[WebhookMessage] = _generate_fake_messages()


class MockDB(MessageStore):
    _db: list[WebhookMessage] = FAKE_MESSAGES

    @classmethod
    def push_message(cls, message: WebhookMessage) -> None:
        cls._db.append(message)

    @classmethod
    def get_messages(cls) -> list[WebhookMessage]:
        return cls._db

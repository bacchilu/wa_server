import json
from typing import Any

import pika
import wa
from wa import WhatsAppMessage

QUEUE = "wa_messages"


def _send_to_queue(message: WhatsAppMessage) -> None:
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            "rabbitmq", credentials=pika.PlainCredentials("admin", "admin")
        )
    )
    channel = connection.channel()
    channel.confirm_delivery()
    channel.queue_declare(queue=QUEUE)
    body = json.dumps({"msg": "Hello World!"})
    channel.basic_publish(
        exchange="",
        routing_key=QUEUE,
        body=body.encode(),
        properties=pika.BasicProperties(delivery_mode=2),
        mandatory=True,
    )
    connection.close()


class MessageReceivedManager:
    def __call__(self, payload: dict[str, Any]) -> list[WhatsAppMessage]:
        data: list[WhatsAppMessage] = wa.parse_notification_payload(payload)
        for message in data:
            _send_to_queue(message)
        return data

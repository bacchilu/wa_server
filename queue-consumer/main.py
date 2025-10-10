import json
import logging
import time
from pprint import pformat

import httpx
import pika
from pika import BasicProperties
from pika.adapters.blocking_connection import BlockingChannel
from pika.spec import Basic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


QUEUE = "wa_messages"
RABBITMQ_HOST = "rabbitmq"
BACKEND_WEBHOOK_URL = "http://backend:8000/webhook"


def callback(
    ch: BlockingChannel, method: Basic.Deliver, properties: BasicProperties, body: bytes
) -> None:
    payload = json.loads(body.decode())
    logger.info(" [x] Received")
    logger.debug(pformat(payload))

    try:
        response = httpx.post(BACKEND_WEBHOOK_URL, json=payload)
        response.raise_for_status()
        logger.info(f" [>] Forwarded to {BACKEND_WEBHOOK_URL} ({response.status_code})")
    except httpx.HTTPError as exc:
        logger.exception(f" [!] Failed to forward to backend: {exc}")


if __name__ == "__main__":
    time.sleep(5)
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            RABBITMQ_HOST, credentials=pika.PlainCredentials("admin", "admin")
        )
    )
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE)
    channel.basic_consume(queue=QUEUE, auto_ack=True, on_message_callback=callback)
    logger.info(" [*] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()
    connection.close()

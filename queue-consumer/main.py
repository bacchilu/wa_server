import json
import time
from pprint import pformat

import httpx
import pika
from pika import BasicProperties
from pika.adapters.blocking_connection import BlockingChannel
from pika.spec import Basic

QUEUE = "wa_messages"
RABBITMQ_HOST = "rabbitmq"
BACKEND_WEBHOOK_URL = "http://backend:8000/webhook"


def callback(
    ch: BlockingChannel, method: Basic.Deliver, properties: BasicProperties, body: bytes
) -> None:
    payload = json.loads(body.decode())
    print(" [x] Received", flush=True)
    print(pformat(payload), flush=True)
    print("", flush=True)

    try:
        response = httpx.post(BACKEND_WEBHOOK_URL, json=payload)
        response.raise_for_status()
        print(
            f" [>] Forwarded to {BACKEND_WEBHOOK_URL} ({response.status_code})",
            flush=True,
        )
    except httpx.HTTPError as exc:
        print(f" [!] Failed to forward to backend: {exc}", flush=True)


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
    print(" [*] Waiting for messages. To exit press CTRL+C", flush=True)
    channel.start_consuming()
    connection.close()

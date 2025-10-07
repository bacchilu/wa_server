import json
import time
from pprint import pformat

import pika
from pika import BasicProperties
from pika.adapters.blocking_connection import BlockingChannel
from pika.spec import Basic

QUEUE = "wa_messages"
RABBITMQ_HOST = "rabbitmq"


def callback(
    ch: BlockingChannel, method: Basic.Deliver, properties: BasicProperties, body: bytes
) -> None:
    print(" [x] Received", flush=True)
    print(pformat(json.loads(body.decode())), flush=True)
    print("")


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

import json
import pprint

import pika
from pika import BasicProperties
from pika.adapters.blocking_connection import BlockingChannel
from pika.spec import Basic

QUEUE = "wa_messages"


def callback(
    ch: BlockingChannel, method: Basic.Deliver, properties: BasicProperties, body: bytes
) -> None:
    print(" [x] Received")
    pprint.pprint(json.loads(body.decode()))
    print("")


if __name__ == "__main__":
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            "localhost", credentials=pika.PlainCredentials("admin", "admin")
        )
    )
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE)
    channel.basic_consume(queue=QUEUE, auto_ack=True, on_message_callback=callback)
    print(" [*] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()
    connection.close()

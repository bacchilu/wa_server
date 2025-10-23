import json
import logging
from datetime import datetime
from typing import Any, Literal

from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict

from ..data_gateway import MockDB
from ..entities import WebhookMessage as WebhookMessageEntity
from ..services import MessagesService

logger = logging.getLogger(__name__)


messages_service = MessagesService(MockDB)


class TextMessage(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["text"]
    customer_id: str
    id: str
    timestamp: datetime
    body: str


class UnsupportedMessage(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: Literal["n/a"]
    type: Literal["unsupported"]
    raw: dict[str, Any]


WebhookMessage = TextMessage | UnsupportedMessage


router = APIRouter()


@router.post("/webhook")
async def webhook(message: WebhookMessage):
    logger.info("Message received (type=%s, id=%s)", message.type, message.id)
    logger.debug("Payload:\n%s", json.dumps(message.model_dump(mode="json"), indent=4))
    dto = WebhookMessageEntity.from_dict(message.model_dump(mode="python"))
    messages_service.push(dto)
    return message

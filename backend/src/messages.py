import logging

from fastapi import APIRouter

from .data_gateway import MockDB
from .services import MessagesService

logger = logging.getLogger(__name__)


messages_service = MessagesService(MockDB)


router = APIRouter()


@router.get("/messages")
async def messages():
    return [m.to_dict() for m in messages_service.get_messages()]

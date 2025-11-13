__all__ = ["router"]

import logging

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from ..services import Authentication

logger = logging.getLogger(__name__)


class AuthRequest(BaseModel):
    username: str
    password: str


router = APIRouter(prefix="/auth", tags=["auth"])
authentication_service = Authentication()


@router.post("/")
async def authenticate(payload: AuthRequest) -> AuthRequest:
    logger.info("Auth attempt for user %s", payload.username)
    if not authentication_service.login(payload.username, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    return payload

from typing import Any


class GenericError(Exception):
    def __init__(self, message: str, payload: dict[str, Any] | None = None):
        payload = {} if payload is None else payload
        self.message = message
        self.payload = payload
        super().__init__(message, payload)

    def __str__(self) -> str:
        return self.message

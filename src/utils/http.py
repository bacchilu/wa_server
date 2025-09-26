from typing import Any

import httpx


async def post_json(
    url: str, payload: dict[str, Any], *, headers: dict[str, str] | None = None
):
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)

    try:
        data = response.json()
    except ValueError:
        data = {"raw": response.text}

    if response.status_code >= 400:
        raise Exception(data)

    return data

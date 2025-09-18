# WhatsApp FastAPI Server

Simple FastAPI wrapper around `pywa` to interact with the WhatsApp Cloud API.

## Prerequisites

- Python 3.11+
- pip

## Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Create a `.env` file with your credentials:
   ```bash
   TOKEN="<your_whatsapp_token>"
   PHONE_ID="<your_whatsapp_phone_id>"
   ```

## Development

Run the FastAPI dev server (reload enabled):

```bash
fastapi dev src/main.py
```

The server exposes the WhatsApp webhooks via the configured FastAPI instance.

## Docker

Build the image and start the container:

```bash
docker build -t wa_server .
docker run --rm -it -p 80:8000 wa_server
```

### Docker Compose

You can achieve the same flow with Compose:

```bash
docker compose up
```

Available services:

- `wa_server_prod`: mirrors the `docker run` command above and publishes the app on `http://localhost/`.
- `wa_server_dev`: runs `fastapi dev src/main.py --host 0.0.0.0`, mounts `src/` for live reload, and exposes the app at `http://localhost:8000/`.

Start an individual service when needed, rebuilding the image if sources changed:

```bash
docker compose up wa_server_prod
docker compose up wa_server_dev
```

### Sample request

```bash
curl -X POST http://127.0.0.1:8000/ \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+39XXXXXXXXXX",
    "text": "Ciao, come stai? Ci sentiamo dopo."
  }'
```

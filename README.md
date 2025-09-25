# WhatsApp FastAPI Server

FastAPI service that surfaces WhatsApp Cloud API webhook verification and helper endpoints via raw Graph API requests—no `pywa` dependency required.

## Prerequisites

- Python 3.11+
- pip

## Installation

1. (Optional) create and activate a virtual environment:
   ```bash
   python -m venv ENV
   source ENV/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with the required credentials:
   ```bash
   TOKEN="<your_whatsapp_token>"
   PHONE_ID="<your_whatsapp_phone_id>"
   ```

Update `src/main.py` if you need to change the verification token or the default recipient used by `/send_test_message`.

## Running locally

Start the FastAPI dev server with autoreload:

```bash
fastapi dev src/main.py
```

The app exposes these endpoints:

- `GET /` – handles the Meta webhook verification challenge and returns HTTP 403 when invalid.
- `POST /` – logs incoming webhook payloads to stdout and responds with `200 OK`.
- `GET /send_test_message` – sends a sample text message through the WhatsApp Cloud API using the configured credentials.
- `POST /send_message` – accepts JSON input and relays a custom WhatsApp message via the Cloud API.

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

### Sample webhook payload

Trigger the webhook handler with a dummy payload while the server runs:

```bash
curl -X POST http://127.0.0.1:8000/ \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [
      {
        "changes": [
          {
            "field": "messages",
            "value": {
              "metadata": { "phone_number_id": "YOUR_PHONE_ID" },
              "messages": [{ "from": "SENDER", "text": { "body": "Ping" } }]
            }
          }
        ]
      }
    ]
  }'
```

### Sample `send_message` request

Send a custom WhatsApp message using the POST endpoint (replace the credentials before running):

```bash
curl -X POST http://127.0.0.1:8000/send_message \
  -H "Content-Type: application/json" \
  -d '{"to":"+393474846411","body":"Ciao Luca, come stai?"}'
```

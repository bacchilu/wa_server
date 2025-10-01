# MSG Manager

MSG Manager is a web application that presents conversations from multiple messaging sources in a unified thread-first experience. The initial integration focuses on WhatsApp via the WA Gateway service housed in `wa-gateway/`.

## Project structure
- `wa-gateway/` – FastAPI-based WhatsApp integration; handles webhooks, verification, and message dispatch.

## Prerequisites
- Docker with the Compose plugin available.
- WhatsApp Cloud API credentials configured in `wa-gateway/.env` (see `wa-gateway/README.md`).

## Running with Docker Compose

```bash
docker compose up wa_gateway_dev
```

`wa_gateway_dev` hot-reloads the FastAPI app and exposes it at `http://localhost:8000/`.

For a production-style build that serves the prebuilt image:

```bash
docker compose up wa_gateway_prod
```

`wa_gateway_prod` publishes the service on `http://localhost/`.

## Next steps
- Expand source integrations (e.g., email, SMS, other chat platforms).
- Build a unified UI to browse and action message threads.
- Add orchestration services for message routing across channels.

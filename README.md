# MSG Manager

MSG Manager brings WhatsApp events into a thread-first experience. The
repository bundles multiple services wired together with Docker Compose so you
can develop the messages panel UI, validate webhook handling, and inspect queue
traffic locally.

## Prerequisites
- Docker 24+ with the Compose plugin
- WhatsApp Cloud API credentials stored in `wa-gateway/.env` (`TOKEN`,
  `PHONE_ID`, `VERIFICATION_TOKEN`)

## Start & Stop the Stack
Set your local user and group IDs before launching Docker so bind mounts inherit the correct permissions:

```bash
export USER_ID="$(id -u)"
export GROUP_ID="$(id -g)"
```

Then start all services with the development Compose file (run commands from the `dev/` directory):

```bash
cd dev
docker compose up
```

To stop and remove the containers, run:

```bash
docker compose down
```

All Docker Compose commands below assume you remain in the `dev/` directory.

## Docker Compose Services

### wa_gateway_dev — port 8000
- **Role:** FastAPI webhook receiver with autoreload for the WhatsApp integration.
- **Run:** `docker compose up wa_gateway_dev`

### wa_gateway_prod — port 80
- **Role:** Production-style build of the gateway served by Uvicorn inside the
  container.
- **Run:** `docker compose up wa_gateway_prod`

### backend — port 8001
- **Role:** Python FastAPI stack that will render the messages panel frontend; mirrors the gateway infrastructure for experimentation.
- **Run:** `docker compose up backend`

### frontend — port 5173
- **Role:** React + Vite development server that serves the same messages panel
  UI from a Node toolchain.
- **Run:** `docker compose up frontend`

### queue_consumer
- **Role:** Python worker that reads the `wa_messages` RabbitMQ queue and
  pretty-prints payloads for debugging.
- **Run:** `docker compose up queue_consumer`

### rabbitmq — ports 5672 / 15672
- **Role:** Message broker used by the gateway and consumer; exposes the
  management UI on port 15672.
- **Run:** `docker compose up rabbitmq`

## Common Workflows
- Start the full stack (gateway dev + UI + broker + consumer): `docker compose up`
- Stop running containers: `docker compose down`
- Follow queue consumer logs: `docker compose logs --follow queue_consumer`

## Next Steps
- Add more inbound connectors (email, SMS, other chat platforms)
- Expand the shared messages panel UI across backend and frontend stacks
- Introduce orchestration layers for routing and analytics

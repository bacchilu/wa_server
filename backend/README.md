# MSG Manager Backend

This directory contains the FastAPI backend that will power the messaging experience surfaced in the `frontend/` app. The service is currently a lightweight scaffold that returns a hello-world payload while the broader API and data orchestration layers are designed.

## Tech Stack
- FastAPI 0.115+ with the `fastapi[standard]` extras bundle for Uvicorn, Starlette, and Pydantic.
- Python 3.13 base image for the development container.

## Running Locally
Install dependencies and start the development server with FastAPI's built-in autoreload:

```bash
pip install -r backend/requirements.txt
fastapi dev backend/src/main.py
```

The API will be available at `http://localhost:8000/` with the interactive docs at `/docs`.

## Docker Compose Workflow
The project-level `docker compose up backend` target builds the container defined in `backend/Dockerfile`, exposes it on port `8001`, and bind-mounts `backend/src/` so code changes reload automatically.

## Layout
- `backend/src/main.py` – FastAPI application entry point.
- `backend/requirements.txt` – Python dependencies.
- `backend/Dockerfile` – Container image used by the compose service.

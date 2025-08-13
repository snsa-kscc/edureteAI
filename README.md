# edureteAI LLM app

LLM chat application for [Edurete](https://edurete.com) platform using large language models.

![edureteAI](https://github.com/snsa-kscc/edureteAI/assets/51080349/276f1ee0-4ef3-409f-8ee1-413e14ad7a4f)

## Context

Edurete mreža znanja is a Croatian company specializing in providing tuition for high school students with emphasis on math.

## Challenge

To provide students with a straightforward approach to novel AI models, and offer a comprehensive and user-friendly way to test multiple models and compare their solutions. Empower students to easily experiment with different AI models and evaluate their outputs.

## Implemented solutions

The app is developed as a chatbot arena web application that uses various LLM APIs, along with their multimodal models, using AI SDK by Vercel. The application utilizes a generative UI architecture, allowing it to stream UI components based on the user's query. This means the app can fully leverage the multimodal capabilities of the models. App uses Clerk as a solution for user management. Chat memory is preserved using kv store, in this case Upstash Redis, as well as additional features, such as billing and rate limiting using Neon serverless PostgreSQL database.

## Architectural diagram

![arch_diagram](https://github.com/user-attachments/assets/c34a6f85-7040-45af-a185-6f65b301f50f)

## Requirements

- Node.js 20+
- pnpm 9+
- Stripe CLI

## How to run the app locally

1. Clone the repository

```bash
git clone https://github.com/snsa-kscc/edureteAI.git
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env.local` file and add the variables from `.env.example` file

```bash
cp .env.example .env.local
```

4. Run the app

```bash
pnpm dev --turbo
```

5. Open the app in your browser

```bash
http://localhost:3000
```

## Local Testing of Python Graph API

The application includes a Python API for generating matplotlib graphs. To test it locally:

### Prerequisites

- Python 3.9+
- pip (Python package manager)

### Setup and Testing

1. Navigate to the project root directory

```bash
cd /path/to/edureteAI
```

2. Install all required packages

```bash
pip install matplotlib numpy pandas seaborn fastapi uvicorn pydantic
```

This installs:

- `matplotlib` - For graph generation
- `numpy` - For numerical operations
- `pandas` - For data manipulation
- `seaborn` - For statistical visualizations
- `fastapi` - For local API server
- `uvicorn` - ASGI server for FastAPI
- `pydantic` - Data validation for API requests

4. Run the Python API locally

```bash
cd api
python generate-graph.py
```

The API will start on `http://localhost:8000` with the following endpoints:

- `GET /` - Health check endpoint
- `POST /` - Generate graph from Python matplotlib code

### Testing the API

You can test the API using curl:

```bash
curl -X POST http://localhost:8000 \
  -H "Content-Type: application/json" \
  -d '{"code": "plt.plot([1, 2, 3, 4], [1, 4, 2, 3]); plt.title(\"Test Graph\")"}'
```

The API will return a JSON response with a base64-encoded PNG image.

---

Made with ❤️ by [dvasadva](https://dvasadva.com).

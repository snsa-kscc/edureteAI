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

## How to run the app locally

1. Clone the repository

```bash
git clone https://github.com/snsa-kscc/edureteAI.git
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env.local` file and add the following variables:

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

---

Made with ❤️ by [dvasadva](https://dvasadva.com).

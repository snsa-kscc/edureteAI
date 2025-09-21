# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- `pnpm dev` - Start development server (Next.js app runs on localhost:3000)
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

### Python Graph API (Local Testing)
- `cd api && python generate-graph.py` - Start Python FastAPI server on localhost:8000
- Install Python dependencies: `pip install matplotlib numpy pandas seaborn fastapi uvicorn pydantic`

### Development Workflow
- In development mode, Python graph API requests are proxied to localhost:8000
- In production, requests go to Vercel serverless functions
- Use `pnpm dev` and run Python API locally for full development experience

## Architecture Overview

### Core Application Structure
This is a Next.js 15 chat application built as a "chatbot arena" that allows users to compare responses from multiple LLM models simultaneously. The app uses AI SDK v5 by Vercel with generative UI capabilities.

### Key Technologies
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **Authentication**: Clerk for user management with Croatian localization
- **Database**: Neon serverless PostgreSQL with Drizzle ORM
- **Cache/Memory**: Upstash Redis for chat persistence
- **File Storage**: AWS S3 (R2) for image uploads
- **Payments**: Stripe for subscription management
- **AI Models**: Multiple providers (OpenAI, Anthropic, Google, TogetherAI, Fireworks)
- **Python Integration**: FastAPI service for matplotlib graph generation
- **Observability**: OpenTelemetry + LangSmith for tracing

### Multi-Model Chat System
- Split-screen interface allowing side-by-side model comparison
- Each chat area ("left"/"right") can use different models and system prompts
- Chat state is preserved per area with separate message histories
- Models include GPT-5, Claude Sonnet 4, Gemini 2.5, DeepSeek R1, etc.

### Database Schema (`db/schema.ts`)
- `usage` - Token usage tracking for billing
- `quotas` - User spending limits by model family
- `limits` - Custom quota limits per user
- `message_counts` - Message counting for subscription tiers
- `subscriptions` - Stripe subscription management

### Subscription System
- Free tier: 50 messages total
- Paid tiers: 1500 messages (eduAI Solo: $9, eduAI Duo: $39)
- Premium models require paid subscription
- Message counting and rate limiting per model family

### Image Support & Tools
- Drag-and-drop image upload with R2 storage
- Models without image support are clearly marked
- `generateGraph` tool integrates with Python matplotlib API
- Tools are defined in `lib/tools.ts`

### Croatian STEM Focus
- Interface and system prompts are in Croatian language
- Specialized for Croatian high school/university students
- STEM-focused but supports general conversation
- LaTeX math rendering with KaTeX for mathematical content

### File Organization
- `app/(app)/` - Main application routes
- `app/(homepage)/` - Landing page
- `components/` - Reusable UI components
- `lib/` - Utility functions, actions, and configurations
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `api/` - Python matplotlib service

### API Routes
- `/api/chat` - Main chat endpoint with streaming
- `/api/generate-graph` - Proxies to Python service
- `/api/stripe` - Stripe webhook handling
- `/api/upload-picture` - Image upload to R2

### Environment Configuration
- Requires multiple API keys for different LLM providers
- Stripe configuration for payments
- Database URLs for Neon and Upstash Redis
- R2/S3 credentials for file storage
- LangSmith for observability

### Model Configuration
- Models defined in `lib/chat-config.ts` and `lib/model-config.ts`
- Each model has family, pricing, and capability settings
- System prompts are family-specific with Croatian language requirements
- Strict LaTeX formatting rules for mathematical content
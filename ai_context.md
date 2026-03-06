# Paktum - Project Information for AI Agents

Welcome to the Paktum project! This document is meant to provide AI coding assistants with a rapid understanding of the project's architecture, stack, and mechanics.

## Tech Stack
- **Framework**: Next.js 16 (App Router `src/app`)
- **Backend/Auth/Database**: Supabase
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: `next-intl` (using `src/app/[locale]` structure)

## Core Functionality
Paktum is a platform where users upload their job contracts for analysis. The system analyzes the contract and advises the user on whether it's okay, what clauses to negotiate, etc.

**Main Workflow:**
1. User uploads a document (PDF, DOCX, TXT, Image).
2. The system extracts text from the document.
    - If it's a DOCX/TXT, text is extracted directly.
    - If it's an image or a PDF without embedded text, it performs OCR (Optical Character Recognition) to extract the text.
3. The extracted text is sent to an AI for analysis.
4. The analysis is stored in the Supabase database.
5. In the future, RAG (Retrieval-Augmented Generation) will be implemented to improve AI analysis.

## Key Configuration & Gotchas
- **Next.js Version**: The project is using Next.js 16. Ensure you rely on Next.js 16 features (like `proxy.ts` instead of `middleware.ts`).
  - **Dynamic APIs**: In Next.js 16, dynamic APIs such as `params` and `searchParams` are Promises. You must always `await` them before access (e.g., `const { id } = await params;`).
  - **Background Execution**: In Next.js 16 Route Handlers, use `after()` from `next/server` to offload heavy background tasks (like embeddings or OpenAI calls) without blocking the client response. This drops response times from ~6s to ~0ms.
- **File Upload Limits**: Next.js limits server action uploads to 1MB and proxy requests to 10MB by default. The `next.config.mjs` has been adjusted to allow up to 30MB uploads using `experimental: { serverActions: { bodySizeLimit: '30mb' } }` and `experimental: { proxyTimeout: ... }` / `proxyClientMaxBodySize`.
- **Database**: The Supabase schema includes tables for `analyses`, `contracts`, `messages`, and potentially more. Refer to `supabase_schema.sql` at the root for the exact schema.
  - The `contracts` table records the `user_email` to allow easier tracking of uploads.
- **Upload Logic**: To avoid user errors, files uploaded undergo a duplicate check using `user_id` and `file_name` to prevent saving the same contract multiple times.
- **PDF Extraction**: We use `pdf-parse` v2, which provides a class-based ES module API: `import { PDFParse } from 'pdf-parse'; const parser = new PDFParse({ data: buffer });`. Do NOT use the old `function` based require approach.
- **Routing**: This project utilizes the Next.js `[locale]` internationalized routing mechanism. Thus, auth routes exist under `src/app/[locale]/(auth)` and other authenticated routes might be similarly nested.

## Recommended Workflow for AI Agents
1. **Always check `.env.local` or environment configurations** when working with Supabase to ensure connection issues aren't due to missing variables.
2. **If adding a Server Action for file reading**, remember it might be blocked by size limits if it involves base64 or large text strings.
3. **Check context7** for the latest documentation on Next.js 16 to avoid deprecated Next.js features.

Use this context to rapidly onboard and understand the project's architectural decisions!

# Lexitron web

## Overview

Lexitron is a tool for accessing information about English words, including
information like definitions, synonyms, rhymes, etymologies, and much more.

Lexitron will have at least three interfaces:
- A web interface, which is a web app at lexitron.org
- An API, served from api.lexitron.org
- A CLI, downloadable via `brew install lexitron` and runnable using the command `lx`

Lexitron might end up having some native databases but will mostly interface
with other services via their APIs in order to serve data to the end user.

## Project Structure

The project follows a modular architecture to support multiple interfaces (web, API, CLI) while sharing core business logic:

```
lexitron-web/
├── src/                   # Shared functionality
│   ├── services/          # Business logic and external API interactions
│   │   └── dictionary.ts  # Dictionary service (external API integrations)
│   ├── types/             # Shared TypeScript type definitions
│   │   └── dictionary.ts  # Dictionary-related types
│   └── utils/             # Shared utilities
├── app/                   # Next.js web application
│   ├── api/               # API routes
│   │   └── search/        # Word search endpoint
│   ├── page.tsx           # Main web interface
│   └── layout.tsx         # App layout
└── public/                # Static assets
```

### Key Components

- **Dictionary Service** (`src/services/dictionary.ts`): Core service that handles word lookups via the Wordnik API. Used by all interfaces to ensure consistent behavior.

- **Shared Types** (`src/types/dictionary.ts`): Contains TypeScript interfaces for word definitions and search results, used throughout the application.

- **API Route** (`app/api/search/route.ts`): Next.js API endpoint that exposes the dictionary service functionality via HTTP.

- **Web Interface** (`app/page.tsx`): React-based web UI for searching and displaying word information.

## Stack

- Typescript
- Bun
- Next.js

## Local Development

1. Clone the repository:
```
git clone https://github.com/rothos/lexitron-web.git
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your API keys
```

4. Start the development server:
```bash
bun dev
```

## Adding New Features

To add new features to Lexitron:

1. **New Word Data Types**: Add to `src/types/dictionary.ts`
2. **New API Integrations**: Add new services in `src/services/`
3. **New API Endpoints**: Add routes under `app/api/`
4. **UI Components**: Add to `app/` directory following Next.js conventions

All new features should follow the existing pattern of keeping business logic in the `src` directory to maintain reusability across interfaces.

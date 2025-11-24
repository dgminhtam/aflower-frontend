# Backoffice Application

This is the internal admin dashboard for the Aflower platform.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS 4
-   **UI Library**: `@workspace/ui` (Shared), Radix UI
-   **Forms**: React Hook Form + Zod
-   **Auth**: Clerk / Auth0 (Migrating to Clerk)

## Getting Started

### Prerequisites

-   Node.js >= 20
-   pnpm >= 9

### Installation

```bash
pnpm install
```

### Running Locally

```bash
pnpm dev --filter backoffice
```

The application will be available at `http://localhost:3001` (or the port specified in console).

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/`: Local components specific to backoffice.
-   `lib/`: Utility functions and business logic.

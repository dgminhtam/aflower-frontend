# Storefront Application

This is the customer-facing e-commerce website for Aflower.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS 4
-   **UI Library**: `@workspace/ui` (Shared)
-   **Auth**: Clerk

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
pnpm dev --filter storefront
```

The application will be available at `http://localhost:3000`.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/`: Local components specific to storefront.

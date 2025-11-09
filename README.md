# 🌸 Aflower Project Monorepo

Welcome to the Aflower e-commerce project. This is a monorepo built with `pnpm`, `Turborepo`, and `Next.js`, powering both the customer-facing **Storefront** and the admin **Backoffice**.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Node.js:** v20.x or higher
* **pnpm:** v10.x or higher (Install with `npm install -g pnpm`)
* **Java (JDK):** v17 or higher (for the backend API)
* **Clerk Account:** You need API keys from [Clerk.com](https://clerk.com/).

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://your-repo-url.com/aflower-frontend.git](https://your-repo-url.com/aflower-frontend.git)
    cd aflower-frontend
    ```

2.  **Install dependencies:**
    Run `pnpm install` from the **root directory**. This will install all dependencies for the entire monorepo (`apps` and `packages`) and link them together.
    ```bash
    pnpm install
    ```

### 2. Environment Configuration

This project uses Clerk for authentication and connects to a separate Java backend.

1.  **Create a `.env` file** in the **root** of the monorepo (`/aflower-frontend/.env`).
2.  Add your secret keys. These will be shared by Turborepo across all apps.

    ```ini
    # .env

    # Clerk Authentication Keys (Shared by both apps)
    # Get these from your Clerk Dashboard -> API Keys
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
    CLERK_SECRET_KEY=sk_live_...

    # URL for the Java Backend API
    NEXT_PUBLIC_JAVA_API_BASE_URL=http://localhost:8080

    # URL for the Storefront (used by Backoffice middleware for redirects)
    STOREFRONT_URL=http://localhost:3000
    ```

### 3. Running the Application

You need to run the Frontend (Next.js apps) and the Backend (Java API) simultaneously in two separate terminals.

#### ⚡ Frontend (Next.js Apps)

This command uses Turborepo to run both `storefront` and `backoffice` in parallel.

```bash
# Run this from the ROOT directory
pnpm dev
cd .\packages\ui
pnpm add @radix-ui/[missing]
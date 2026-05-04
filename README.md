# International Payments App

A web application for registering customers, signing in with MFA, managing beneficiaries, and creating international payment instructions.

This repository currently contains the frontend application. The frontend connects to a deployed backend REST API through `VITE_API_BASE_URL`.

## Applications

| App | Location | Description |
| --- | --- | --- |
| Frontend | Repository root | React, TypeScript, Vite single-page app. |
| Backend API | Deployed external service | REST API used for authentication, MFA, beneficiaries, and payments. Backend source code is not included in this repository. |

Detailed READMEs:

- [Frontend README](docs/frontend/README.md)
- [Backend API README](docs/backend/README.md)

## Quick Start

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Start the frontend:

```bash
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

## Backend Connection

The frontend reads the backend URL from:

```env
VITE_API_BASE_URL=https://international-payments-api-effxgrgvhwg3afgq.southafricanorth-01.azurewebsites.net
```

To use a local backend, update `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Restart the Vite dev server after changing `.env`.

## Tools Used

| Area | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite, Redux Toolkit, React Router, TanStack React Form, Tailwind CSS, Lucide React, Axios/fetch |
| Quality | ESLint, TypeScript compiler, npm audit |
| DevOps/Security | GitHub Actions, CodeQL, Dependency Review |
| Backend integration | REST/JSON API, bearer token authentication, email MFA, Azure-hosted API endpoint |
| AI tools | GitHub Copilot/Codex-style assistance may be used during development; no AI service is required at runtime |
| Not used in this repo | Firebase, FlutterFlow, Base44 |

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## Project Structure

```text
.
  docs/
    frontend/       Frontend setup and usage guide
    backend/        Backend API integration guide
  public/           Static assets
  src/
    components/     Reusable UI and layout components
    hooks/          Typed Redux hooks
    pages/          Route-level screens
    services/       Backend API and mock data services
    store/          Redux store and slices
    types/          Shared TypeScript types
```

## Notes

- Authentication, registration, beneficiaries, and payments call the configured backend API.
- Some profile-related behavior still uses in-memory mock data from `src/services/mockApi.ts`.
- Auth tokens are stored in browser `sessionStorage`.

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
| Frontend | React, TypeScript, Vite, Redux Toolkit, React Router, TanStack React Form, Tailwind CSS, Lucide React, fetch |
| Quality | ESLint, TypeScript compiler, npm audit |
| DevOps/Security | CircleCI, SonarCloud/SonarQube scan, GitHub Actions, CodeQL, Dependency Review |
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

## GitHub Actions Deployment

The DevSecOps workflow runs dependency audit, linting, TypeScript checks, tests when a test script exists, production build, CodeQL, and dependency review.

On every push to `main`, the workflow deploys the built `dist` folder to Azure App Service after the quality and CodeQL jobs pass.

Configure these GitHub repository settings before deploying:

| Type | Name | Value |
| --- | --- | --- |
| Repository variable | `AZURE_WEBAPP_NAME` | Azure App Service app name |
| Repository secret | `AZURE_WEBAPP_PUBLISH_PROFILE` | Publish profile XML downloaded from the Azure App Service |
| Repository variable, optional | `VITE_API_BASE_URL` | Backend API base URL used during the Vite build |

For Linux App Service hosting a static Vite build, configure the App Service startup command to serve the deployed files as a single-page app, for example:

```bash
pm2 serve /home/site/wwwroot --spa --no-daemon
```

## CircleCI SonarCloud Pipeline

The CircleCI pipeline in `.circleci/config.yml` runs on repository changes and performs:

- production dependency audit
- ESLint
- TypeScript checks
- tests when a test script exists
- production build
- SonarCloud/SonarQube scan for security hotspots, code smells, vulnerabilities, and quality gate status

The SonarCloud project settings are stored in `sonar-project.properties`:

```text
sonar.projectKey=BongumusaCele_International-Payments-APP-UI-REACT
sonar.organization=bongumusacele
sonar.host.url=https://sonarcloud.io
```

Configure this CircleCI project environment variable:

| Type | Name | Value |
| --- | --- | --- |
| CircleCI project environment variable | `SONAR_TOKEN` | SonarCloud analysis token |

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

## Employee Portal Demo

The employee portal currently uses frontend-only mock data until backend employee APIs are available.

Routes:

| Route | Purpose |
| --- | --- |
| `/employee/login` | Employee sign in |
| `/employee/dashboard` | Employee operations dashboard |
| `/employee/payments` | Transaction review queue |

Demo employee logins:

| Employee number | Password | Role |
| --- | --- | --- |
| `EMP001` | `Password123!` | Payments Officer |
| `EMP002` | `Password123!` | Senior Payments Officer |

Employees can review mock customer transactions, verify payee account and SWIFT/BIC details, and submit verified items to a simulated SWIFT flow.

## Notes

- Authentication, registration, beneficiaries, and payments call the configured backend API.
- Some profile-related behavior still uses in-memory mock data from `src/services/mockApi.ts`.
- Employee portal behavior currently uses in-memory mock data from `src/services/employeeMockApi.ts`.
- Auth tokens are stored in browser `sessionStorage`.

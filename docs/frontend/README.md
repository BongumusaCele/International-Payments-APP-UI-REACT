# Frontend App README

The frontend is a React single-page application for an international payments workflow. It includes landing, registration, MFA login, dashboard, payments, beneficiaries, and profile screens.

## Tools Used

| Purpose | Tool |
| --- | --- |
| UI framework | React |
| Language | TypeScript |
| Build tool/dev server | Vite |
| Routing | React Router |
| State management | Redux Toolkit, React Redux |
| Forms | TanStack React Form |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| API calls | Browser `fetch` |
| Quality checks | ESLint, TypeScript compiler |
| Package manager | npm |
| AI tools | Optional development assistance only; no AI runtime dependency |
| Not used | Firebase, FlutterFlow, Base44 |

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

Check versions:

```bash
node --version
npm --version
```

## Setup

From the repository root, install dependencies:

```bash
npm install
```

Create `.env` from the example file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Confirm the backend API URL:

```env
VITE_API_BASE_URL=https://international-payments-api-effxgrgvhwg3afgq.southafricanorth-01.azurewebsites.net
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Open the URL printed in the terminal, usually:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite may choose another port. Use the URL shown by the command output.

## Build And Preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Quality Checks

Run ESLint:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npm run typecheck
```

Run the same core checks used by CI:

```bash
npm audit --omit=dev --audit-level=high
npm run lint
npm run typecheck
npm test --if-present
npm run build
```

The GitHub Actions workflow also runs CodeQL, pull request dependency review, and SonarCloud analysis. SonarCloud requires these GitHub Actions settings:

| Type | Name | Description |
| --- | --- | --- |
| Repository variable, optional | `SONAR_HOST_URL` | SonarCloud URL. Defaults to `https://sonarcloud.io` |
| Repository variable | `SONAR_ORGANIZATION` | SonarCloud organization key |
| Repository variable | `SONAR_PROJECT_KEY` | SonarCloud project key |
| Repository variable, optional | `SONAR_PROJECT_NAME` | Friendly project name |
| Repository secret | `SONAR_TOKEN` | SonarCloud project analysis token |

## Environment Variables

Vite exposes only variables prefixed with `VITE_`.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Base URL for the backend API. |

If `.env` is missing, the app falls back to the deployed Azure API URL configured in the service files.

## Authentication Flow

1. Register a customer from `/register`.
2. Sign in from `/login` with username, account number, and password.
3. Enter the MFA code sent by the backend.
4. After successful verification, the app stores the bearer token in `sessionStorage`.
5. Protected API requests include the token in the `Authorization` header.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/register` | Customer registration |
| `/login` | Login and MFA |
| `/dashboard` | Authenticated overview |
| `/payments` | Payment list |
| `/payments/create` | Create payment |
| `/beneficiaries` | Manage beneficiaries |
| `/profile` | Profile settings |
| `/employee/login` | Employee login |
| `/employee/dashboard` | Employee operations dashboard |
| `/employee/payments` | Employee transaction review queue |

## Employee Portal Demo

The employee portal currently uses frontend-only mock data until backend employee APIs are available.

| Employee number | Password | Role |
| --- | --- | --- |
| `EMP001` | `Password123!` | Payments Officer |
| `EMP002` | `Password123!` | Senior Payments Officer |

Employees can review mock customer transactions, verify payee account and SWIFT/BIC details, and submit verified items to a simulated SWIFT flow.

## Data Sources

- `src/services/authApi.ts` calls backend authentication endpoints.
- `src/services/beneficiaryApi.ts` calls backend beneficiary endpoints.
- `src/services/paymentApi.ts` calls backend payment endpoints.
- `src/services/mockApi.ts` contains in-memory mock data used by profile-related flows.
- `src/services/employeeMockApi.ts` contains in-memory mock data used by employee portal flows.

## Troubleshooting

### Environment changes are not applied

Restart the Vite dev server after editing `.env`.

### Login or registration fails

Check that `VITE_API_BASE_URL` is correct and the backend API is reachable. Also confirm that the account number is numeric and that the MFA email can be received.

### Build fails after pulling changes

Reinstall dependencies and build again:

```bash
npm install
npm run build
```

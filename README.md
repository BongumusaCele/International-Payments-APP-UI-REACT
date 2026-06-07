# International Payments App

React/Vite frontend for customer international payments and a demo bank employee review portal.

The app connects to an external backend API through `VITE_API_BASE_URL`. Employee portal data is currently mocked in the frontend.

## Run Locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

To override the backend URL, create `.env`:

```env
VITE_API_BASE_URL=https://international-payments-api-effxgrgvhwg3afgq.southafricanorth-01.azurewebsites.net
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/register` | Customer registration |
| `/login` | Customer login and MFA |
| `/dashboard` | Customer dashboard |
| `/payments` | Customer payments |
| `/beneficiaries` | Customer beneficiaries |
| `/employee/login` | Employee login |
| `/employee/dashboard` | Employee dashboard |
| `/employee/payments` | Employee transaction review |

## Employee Demo Login

| Employee number | Password | Role |
| --- | --- | --- |
| `EMP001` | `Password123!` | Payments Officer |
| `EMP002` | `Password123!` | Senior Payments Officer |

Employees can review transactions, verify payee/SWIFT details, and submit verified payments to a simulated SWIFT flow.

## CI/CD

GitHub Actions deploys the frontend to Azure App Service after quality checks pass.

Required GitHub settings:

| Type | Name |
| --- | --- |
| Repository variable | `AZURE_WEBAPP_NAME` |
| Repository secret | `AZURE_WEBAPP_PUBLISH_PROFILE` |
| Repository variable, optional | `VITE_API_BASE_URL` |

CircleCI runs dependency audit, linting, TypeScript checks, build, and SonarCloud/SonarQube analysis.

Required CircleCI environment variable:

| Name |
| --- |
| `SONAR_TOKEN` |

SonarCloud project settings are in `sonar-project.properties`.

## More Docs

- [Frontend README](docs/frontend/README.md)
- [Backend API README](docs/backend/README.md)

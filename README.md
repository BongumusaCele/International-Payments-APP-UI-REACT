# International Payments App

React/Vite frontend for customer international payments and a demo bank employee review portal.

The app connects to an external backend API through `VITE_API_BASE_URL`, including the employee payment review portal.

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

| Employee username | Password | Role |
| --- | --- | --- |
| `employee1` | `Password123!` | Payments Officer |
| `employee2` | `Password123!` | Senior Payments Officer |

Employees can review transactions, verify payee/SWIFT details, and submit verified payments to a simulated SWIFT flow.

## DevSecOps Pipeline Setup

The frontend and backend both use GitHub Actions for build/security/deployment and CircleCI for SonarCloud quality analysis.

| Area | Frontend | Backend |
| --- | --- | --- |
| Main toolchain | Node.js 20, npm, Vite, TypeScript, ESLint | .NET 10 SDK, ASP.NET Core, NuGet |
| GitHub Actions | `.github/workflows/devsecops.yml` | Backend repo `.github/workflows/devsecops.yml` |
| CircleCI | `.circleci/config.yml` | Backend repo `.circleci/config.yml` |
| SonarCloud config | `sonar-project.properties` | Backend repo `sonar-project.properties` |
| Security checks | `npm audit`, ESLint, TypeScript, CodeQL, dependency review | NuGet vulnerability scan, middleware check, CodeQL, dependency review |
| Deployment target | Azure App Service frontend | Azure App Service backend API |

Required GitHub repository settings for each deployable app:

| Type | Name | Notes |
| --- | --- | --- |
| Repository variable | `AZURE_WEBAPP_NAME` | Azure App Service name for that repo |
| Repository secret | `AZURE_WEBAPP_PUBLISH_PROFILE` | Download from Azure App Service publish profile |
| Repository variable, frontend only | `VITE_API_BASE_URL` | Optional API URL override |

Required CircleCI environment variable for both repos:

| Name | Purpose |
| --- | --- |
| `SONAR_TOKEN` | Allows CircleCI to publish analysis to SonarCloud/SonarQube |

Tool declarations are intentionally kept in the pipeline files so CI remains the source of truth for versions and checks.

## More Docs

- [Frontend README](docs/frontend/README.md)
- [Backend API README](docs/backend/README.md)

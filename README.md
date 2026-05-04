# Payments App

A React, TypeScript, Redux Toolkit, Tailwind CSS, and Vite frontend for an international payments workflow. The app includes landing, registration, login, dashboard, payments, beneficiaries, and profile screens.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

Check your installed versions:

```bash
node --version
npm --version
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

3. Confirm the API URL in `.env`:

```env
VITE_API_BASE_URL=https://international-payments-api-effxgrgvhwg3afgq.southafricanorth-01.azurewebsites.net
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Signing In

The login and registration screens use the backend API configured by `VITE_API_BASE_URL`.

To create a user:

1. Open `/register`.
2. Complete the registration form.
3. After a successful registration, go to `/login`.
4. Sign in with the username, account number, and password you registered.

After login, protected routes such as `/dashboard`, `/payments`, `/beneficiaries`, and `/profile` become available.

## Available Scripts

Run the app locally:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npm run typecheck
```

## How Data Works

- Authentication, registration, and beneficiary management call the configured backend API.
- Payments and profile actions currently use in-memory mock data from `src/services/mockApi.ts`.
- Auth state is stored in browser `localStorage`, so signing out or clearing site data resets the session.

## Environment Variables

Vite only exposes environment variables that start with `VITE_`.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Backend API base URL used for registration and login. |

If `.env` is missing, the app falls back to the Azure API URL defined in `src/services/authApi.ts`.

## Authentication And MFA

The backend login flow uses email MFA:

1. Submit username, account number, and password.
2. The backend emails a 6-digit verification code.
3. Submit the code to complete login and receive a bearer session token.
4. Protected API requests include the token in the `Authorization` header.

For production, configure SMTP settings on the backend App Service:

```text
Email__SmtpHost
Email__SmtpPort
Email__Username
Email__Password
Email__FromAddress
Email__FromName
Email__EnableSsl
Email__EnableSending=true
```

If `Email__EnableSending` is false, the backend logs the OTP instead of sending email. Use that only for local development.

## Troubleshooting

### Port 5173 is already in use

Vite will usually choose another port automatically. Use the URL shown in your terminal.

### Login fails after registration

Check that:

- The backend API is reachable.
- `VITE_API_BASE_URL` is correct.
- You are using the exact username, numeric account number, and password from registration.

### Environment changes are not taking effect

Stop the dev server and start it again:

```bash
npm run dev
```

### Build fails because dependencies are missing

Install dependencies again:

```bash
npm install
```

Then rerun:

```bash
npm run build
```

## Project Structure

```text
src/
  components/       Reusable UI and layout components
  hooks/            Typed Redux hooks
  pages/            Route-level screens
  services/         API and mock data services
  store/            Redux store and slices
  types/            Shared TypeScript types
```

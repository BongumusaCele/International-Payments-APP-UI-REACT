# Backend API README

The backend API handles customer registration, login, MFA verification, beneficiary management, and payment operations for the frontend app.

Backend source code is not included in this repository. This README documents the API integration and the runtime settings expected by the frontend.

## Tools Used

| Purpose | Tool |
| --- | --- |
| API style | REST/JSON API |
| Hosting | Azure-hosted API endpoint |
| Authentication | Bearer token sessions |
| MFA | Email OTP verification |
| Email delivery | SMTP configuration |
| Frontend integration | Vite `VITE_API_BASE_URL` |
| AI tools | Optional development assistance only; no AI runtime dependency |
| Not used in this repo | Firebase, FlutterFlow, Base44 |

## Base URL

The deployed API currently used by the frontend is:

```text
https://international-payments-api-effxgrgvhwg3afgq.southafricanorth-01.azurewebsites.net
```

The frontend points to this service through:

```env
VITE_API_BASE_URL=https://international-payments-api-effxgrgvhwg3afgq.southafricanorth-01.azurewebsites.net
```

## Run The Backend

Because the backend source is not present in this repository, it cannot be started from this checkout.

Use one of these options:

1. Use the deployed API by keeping `VITE_API_BASE_URL` set to the Azure URL above.
2. If you have the backend source in a separate repository, start that backend locally and update the frontend `.env` to its local URL, for example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

After changing the frontend `.env`, restart the Vite dev server:

```bash
npm run dev
```

If the backend is an ASP.NET Core service, the typical local commands in the backend repository are:

```bash
dotnet restore
dotnet run
```

Use the actual backend repository README if it defines different commands, ports, database setup, or migration steps.

## Required Backend Capabilities

The frontend expects the backend to support:

- JSON request and response bodies.
- CORS access from the frontend dev server, usually `http://localhost:5173`.
- Bearer token authentication for protected requests.
- Numeric customer, beneficiary, and payment IDs.
- Email MFA during login.
- Consistent error responses with `message`, `title`, or validation `errors`.

## Authentication Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/Auth/register` | Register a customer |
| `POST` | `/api/Auth/login` | Start login and possibly request MFA |
| `POST` | `/api/Auth/verify-mfa` | Verify MFA OTP and return token |
| `POST` | `/api/Auth/logout` | End session |

Login sends:

```json
{
  "username": "customername",
  "account_Number": 123456789,
  "password_Hash": "password"
}
```

MFA verification sends:

```json
{
  "mfa_Challenge_Id": "challenge-id",
  "otp_Code": "123456"
}
```

## Beneficiary Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/Beneficiary/customer/{customerId}` | List customer beneficiaries |
| `POST` | `/api/Beneficiary/add` | Add beneficiary |
| `PUT` | `/api/Beneficiary/update/{beneficiaryId}` | Update beneficiary |
| `DELETE` | `/api/Beneficiary/delete/{beneficiaryId}` | Delete beneficiary |

Protected beneficiary requests include:

```http
Authorization: Bearer <token>
```

## Payment Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/Payment/customer/{customerId}` | List customer payments |
| `GET` | `/api/Payment/{paymentId}` | Get payment details |
| `POST` | `/api/Payment/create` | Create payment |
| `GET` | `/api/Payment/summary/customer/{customerId}` | Get customer payment summary |

Protected payment requests include:

```http
Authorization: Bearer <token>
```

## Email MFA Settings

The deployed backend uses email MFA. Configure these settings in the backend hosting environment:

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

For local development, some backends allow `Email__EnableSending=false` and log the OTP instead of sending it. Use that only outside production.

## Frontend Integration Checklist

- Set `VITE_API_BASE_URL` to the backend URL.
- Enable CORS for the frontend origin.
- Ensure `/api/Auth/login` returns MFA challenge details when MFA is required.
- Ensure `/api/Auth/verify-mfa` returns a bearer token and customer details.
- Ensure protected endpoints accept `Authorization: Bearer <token>`.
- Keep response field names compatible with the frontend service mappers in `src/services/`.

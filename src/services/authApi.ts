import { LoginRequest, LoginResult, RegisterRequest, RegisterResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || 'https://international-payments-api-effxgrgvhwg3afgq.southafricanorth-01.azurewebsites.net';

interface ApiRegisterResponse {
  success: boolean;
  message: string;
  customer_Id?: number;
  username?: string;
}

interface ApiLoginResponse {
  success: boolean;
  message: string;
  customer_Id: number;
  full_Name: string;
  username: string;
  account_Number: number;
  preferred_Currency?: string;
}

const readErrorMessage = async (response: Response) => {
  try {
    const body = await response.json();

    const validationValues = body?.errors ? Object.values(body.errors) : Object.values(body);
    const modelStateMessages = validationValues
      .flatMap((value) => Array.isArray(value) ? value : [])
      .filter((value): value is string => typeof value === 'string');

    if (modelStateMessages.length > 0) return modelStateMessages.join(' ');
    if (typeof body?.message === 'string') return body.message;
    if (typeof body?.title === 'string') return body.title;
  } catch {
    // Fall through to the generic HTTP message below.
  }

  return `Request failed with status ${response.status}`;
};

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResult> => {
    const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        account_Number: Number(data.accountNumber),
        password_Hash: data.password,
      }),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as ApiLoginResponse;

    if (!body.success) {
      throw new Error(body.message || 'Login failed');
    }

    return {
      token: `customer-session-${body.customer_Id}`,
      message: body.message,
      user: {
        id: String(body.customer_Id),
        fullName: body.full_Name,
        email: '',
        username: body.username,
        idNumber: '',
        accountNumber: String(body.account_Number),
        preferredCurrency: body.preferred_Currency || 'ZAR',
        mfaEnabled: false,
        createdAt: new Date().toISOString(),
      },
    };
  },

  register: async (data: RegisterRequest): Promise<RegisterResult> => {
    const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_Name: data.firstName,
        last_Name: data.lastName,
        id_Number: data.idNumber,
        email_Address: data.email,
        account_Number: Number(data.accountNumber),
        preferred_Currency: data.preferredCurrency,
        username: data.username,
        password: data.password,
        confirm_Password: data.confirmPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as ApiRegisterResponse;

    return {
      success: body.success,
      message: body.message,
      customerId: body.customer_Id,
      username: body.username,
    };
  },
};

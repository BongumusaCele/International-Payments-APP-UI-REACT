import {
  EmployeeLoginRequest,
  EmployeePaymentReview,
  EmployeePaymentSummary,
  EmployeeUser,
} from '../types';
import { API_BASE_URL } from './apiConfig';

interface EmployeeLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  token_Expires_On?: string;
  employee_Id?: number;
  username?: string;
  full_Name?: string;
}

interface EmployeeLoginResult {
  employee: EmployeeUser;
  token: string;
}

interface ApiEmployeePaymentResponse {
  payment_Id: number;
  customer_Id: number;
  customer_Name?: string;
  customer_Account_Number?: number;
  beneficiary_Id: number;
  amount: number;
  from_Currency?: string;
  to_Currency?: string;
  currency?: string;
  beneficiary_Name?: string;
  recipient_Account_Number?: string;
  recipient_Bank_Name?: string;
  recipient_Country?: string;
  swift_Code?: string;
  payment_Reference?: string;
  payment_Provider?: string;
  status: string;
  created_On: string;
  updated_On?: string;
  verified_On?: string;
  submitted_To_Swift_On?: string;
  rejected_On?: string;
  rejection_Reason?: string;
  message?: string;
  success?: boolean;
}

const readErrorMessage = async (response: Response) => {
  const fallbackMessage = `Request failed with status ${response.status}`;

  try {
    const responseText = await response.text();
    if (!responseText) return fallbackMessage;

    const body = JSON.parse(responseText) as Record<string, unknown>;
    const validationValues = body.errors && typeof body.errors === 'object'
      ? Object.values(body.errors)
      : Object.values(body);
    const modelStateMessages = validationValues
      .flatMap((value) => Array.isArray(value) ? value : [])
      .filter((value): value is string => typeof value === 'string');

    if (modelStateMessages.length > 0) return modelStateMessages.join(' ');
    if (typeof body.message === 'string') return body.message;
    if (typeof body.title === 'string') return body.title;
  } catch {
    // Fall through to the generic HTTP message below.
  }

  return fallbackMessage;
};

const employeeAuthHeaders = (): Record<string, string> => {
  const token = sessionStorage.getItem('employeeToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const employeeRole = (username: string): EmployeeUser['role'] =>
  username.toLowerCase() === 'employee2' ? 'Senior Payments Officer' : 'Payments Officer';

const mapEmployee = (body: EmployeeLoginResponse): EmployeeUser => {
  const username = body.username || `employee-${body.employee_Id || 'unknown'}`;

  return {
    id: String(body.employee_Id || username),
    fullName: body.full_Name || username,
    email: '',
    employeeNumber: username,
    role: employeeRole(username),
    branch: 'Payments Operations',
  };
};

const mapStatus = (status: string): EmployeePaymentReview['status'] => {
  switch (status) {
    case 'Pending':
    case 'UnderReview':
    case 'Under Review':
      return 'Under Review';
    case 'Verified':
      return 'Verified';
    case 'SubmittedToSwift':
    case 'Submitted to SWIFT':
      return 'Submitted to SWIFT';
    case 'Rejected':
      return 'Rejected';
    default:
      return 'Under Review';
  }
};

const mapPayment = (payment: ApiEmployeePaymentResponse): EmployeePaymentReview => ({
  id: String(payment.payment_Id),
  paymentReference: payment.payment_Reference || `PAY-${payment.payment_Id}`,
  customerName: payment.customer_Name || `Customer ${payment.customer_Id}`,
  customerAccountNumber: payment.customer_Account_Number
    ? String(payment.customer_Account_Number)
    : String(payment.customer_Id),
  amount: Number(payment.amount),
  currency: payment.from_Currency || payment.currency || 'ZAR',
  beneficiaryName: payment.beneficiary_Name || `Beneficiary ${payment.beneficiary_Id}`,
  recipientAccountNumber: payment.recipient_Account_Number || '',
  recipientBankName: payment.recipient_Bank_Name || '',
  swiftCode: payment.swift_Code || '',
  country: payment.recipient_Country || '',
  status: mapStatus(payment.status),
  createdAt: payment.created_On,
  verifiedAt: payment.verified_On,
  submittedAt: payment.submitted_To_Swift_On,
  swiftReference: payment.submitted_To_Swift_On ? `SWIFT-${payment.payment_Id}` : undefined,
  verificationNotes: payment.verified_On
    ? 'Payee account details and SWIFT/BIC code verified.'
    : undefined,
  rejectionReason: payment.rejection_Reason || undefined,
});

const summarize = (payments: EmployeePaymentReview[]): EmployeePaymentSummary => ({
  underReviewCount: payments.filter((payment) => payment.status === 'Under Review').length,
  verifiedCount: payments.filter((payment) => payment.status === 'Verified').length,
  submittedCount: payments.filter((payment) => payment.status === 'Submitted to SWIFT').length,
  rejectedCount: payments.filter((payment) => payment.status === 'Rejected').length,
});

const postAction = async (path: string) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: employeeAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
};

const postJsonAction = async (path: string, body: Record<string, unknown>) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...employeeAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
};

export const employeeApi = {
  login: async (data: EmployeeLoginRequest): Promise<EmployeeLoginResult> => {
    const response = await fetch(`${API_BASE_URL}/api/employee/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.employeeNumber.trim(),
        password: data.password,
      }),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as EmployeeLoginResponse;

    if (!body.success || !body.token) {
      throw new Error(body.message || 'Employee login failed');
    }

    return {
      employee: mapEmployee(body),
      token: body.token,
    };
  },

  logout: async (): Promise<void> => {
    const token = sessionStorage.getItem('employeeToken');
    if (!token) return;

    const response = await fetch(`${API_BASE_URL}/api/employee/auth/logout`, {
      method: 'POST',
      headers: employeeAuthHeaders(),
    });

    if (!response.ok && response.status !== 401 && response.status !== 404) {
      throw new Error(await readErrorMessage(response));
    }
  },

  getPayments: async (): Promise<EmployeePaymentReview[]> => {
    const response = await fetch(`${API_BASE_URL}/api/employee/payments`, {
      headers: employeeAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as ApiEmployeePaymentResponse[];
    return body.map(mapPayment);
  },

  getSummary: async (): Promise<EmployeePaymentSummary> => {
    return summarize(await employeeApi.getPayments());
  },

  verifyPayment: async (paymentId: string): Promise<EmployeePaymentReview> => {
    await postAction(`/api/employee/payments/${paymentId}/verify`);
    const payments = await employeeApi.getPayments();
    const payment = payments.find((item) => item.id === paymentId);

    if (!payment) {
      throw new Error('Verified transaction was not returned by the backend');
    }

    return payment;
  },

  submitToSwift: async (paymentId: string): Promise<EmployeePaymentReview> => {
    await postAction(`/api/employee/payments/${paymentId}/submit-to-swift`);
    const payments = await employeeApi.getPayments();
    const payment = payments.find((item) => item.id === paymentId);

    if (!payment) {
      throw new Error('Submitted transaction was not returned by the backend');
    }

    return payment;
  },

  rejectPayment: async (
    paymentId: string,
    rejectionReason: string
  ): Promise<EmployeePaymentReview> => {
    await postJsonAction(`/api/employee/payments/${paymentId}/reject`, {
      rejection_Reason: rejectionReason,
    });

    const payments = await employeeApi.getPayments();
    const payment = payments.find((item) => item.id === paymentId);

    if (!payment) {
      throw new Error('Rejected transaction was not returned by the backend');
    }

    return payment;
  },
};

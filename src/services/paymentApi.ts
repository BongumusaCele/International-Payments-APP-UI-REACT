import { Payment, PaymentCreateRequest, PaymentSummary } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || 'https://international-payments-api-effxgrgvhwg3afgq.southafricanorth-01.azurewebsites.net';

const authHeaders = (): Record<string, string> => {
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface ApiPaymentResponse {
  payment_Id: number;
  customer_Id: number;
  beneficiary_Id: number;
  amount: number;
  from_Currency: string;
  to_Currency: string;
  exchange_Rate_Used: number;
  converted_Amount: number;
  beneficiary_Name?: string;
  recipient_Account_Number?: string;
  recipient_Bank_Name?: string;
  swift_Code?: string;
  payment_Reference?: string;
  payment_Provider?: string;
  payment_Reason?: string;
  status: Payment['status'];
  created_On: string;
  updated_On?: string;
  message?: string;
  success?: boolean;
}

interface ApiPaymentSummaryResponse {
  total_Payments: number;
  total_Amount: number;
  pending_Count: number;
  under_Review_Count: number;
  approved_Count: number;
  rejected_Count: number;
  completed_Count: number;
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

const ensureNumericId = (value: string, label: string) => {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    throw new Error(`${label} must be a valid number`);
  }

  return numericValue;
};

const mapPayment = (payment: ApiPaymentResponse): Payment => ({
  id: String(payment.payment_Id),
  amount: Number(payment.amount),
  currency: payment.from_Currency,
  convertedAmount: Number(payment.converted_Amount),
  toCurrency: payment.to_Currency,
  beneficiaryId: String(payment.beneficiary_Id),
  beneficiaryName: payment.beneficiary_Name || 'Beneficiary',
  provider: payment.payment_Provider || 'SWIFT',
  recipientAccountNumber: payment.recipient_Account_Number || '',
  recipientBankName: payment.recipient_Bank_Name || '',
  swiftCode: payment.swift_Code || '',
  paymentReference: payment.payment_Reference || `PAY-${payment.payment_Id}`,
  status: payment.status,
  createdAt: payment.created_On,
  updatedAt: payment.updated_On || payment.created_On,
  notes: payment.payment_Reason,
});

const mapSummary = (summary: ApiPaymentSummaryResponse): PaymentSummary => ({
  totalPayments: summary.total_Payments,
  totalAmount: Number(summary.total_Amount),
  pendingCount: summary.pending_Count,
  underReviewCount: summary.under_Review_Count,
  approvedCount: summary.approved_Count,
  rejectedCount: summary.rejected_Count,
  completedCount: summary.completed_Count,
});

export const paymentApi = {
  getPayments: async (userId: string): Promise<Payment[]> => {
    const response = await fetch(`${API_BASE_URL}/api/Payment/customer/${ensureNumericId(userId, 'Customer ID')}`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as ApiPaymentResponse[];
    return body.map(mapPayment);
  },

  getPaymentById: async (_userId: string, paymentId: string): Promise<Payment> => {
    const response = await fetch(`${API_BASE_URL}/api/Payment/${ensureNumericId(paymentId, 'Payment ID')}`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    return mapPayment(await response.json() as ApiPaymentResponse);
  },

  createPayment: async (userId: string, data: PaymentCreateRequest): Promise<Payment> => {
    const response = await fetch(`${API_BASE_URL}/api/Payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({
        customer_Id: ensureNumericId(userId, 'Customer ID'),
        beneficiary_Id: ensureNumericId(data.beneficiaryId, 'Beneficiary ID'),
        amount: data.amount,
        payment_Reference: data.paymentReference.trim(),
        payment_Provider: data.provider.trim(),
        swift_Code: data.swiftCode.trim().toUpperCase(),
        payment_Reason: data.paymentReason?.trim() || null,
      }),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as ApiPaymentResponse;
    if (body.success === false) {
      throw new Error(body.message || 'Failed to create payment');
    }

    return mapPayment(body);
  },

  getPaymentSummary: async (userId: string): Promise<PaymentSummary> => {
    const response = await fetch(`${API_BASE_URL}/api/Payment/summary/customer/${ensureNumericId(userId, 'Customer ID')}`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    return mapSummary(await response.json() as ApiPaymentSummaryResponse);
  },
};

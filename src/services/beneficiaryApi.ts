import { Beneficiary, BeneficiaryRequest } from '../types';
import { API_BASE_URL } from './apiConfig';
import { readErrorMessage } from './apiErrors';

const authHeaders = (): Record<string, string> => {
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface ApiBeneficiaryResponse {
  beneficiary_Id: number;
  customer_Id: number;
  currency_Id?: number;
  currency_Code?: string;
  beneficiary_Name: string;
  bank_Name: string;
  account_Number: string;
  swift_Code?: string;
  country?: string;
}

interface ApiMutationResponse {
  success: boolean;
  message: string;
  beneficiary_Id?: number;
}

const ensureNumericId = (value: string, label: string) => {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    throw new Error(`${label} must be a valid number`);
  }

  return numericValue;
};

const mapBeneficiary = (beneficiary: ApiBeneficiaryResponse): Beneficiary => ({
  id: String(beneficiary.beneficiary_Id),
  name: beneficiary.beneficiary_Name,
  accountNumber: String(beneficiary.account_Number),
  bankName: beneficiary.bank_Name,
  swiftCode: beneficiary.swift_Code || '',
  country: beneficiary.country || '',
  currency: beneficiary.currency_Code,
  currencyId: beneficiary.currency_Id ? String(beneficiary.currency_Id) : undefined,
});

const toApiPayload = (customerId: string, data: BeneficiaryRequest) => ({
  customer_Id: ensureNumericId(customerId, 'Customer ID'),
  beneficiary_Name: data.name.trim(),
  bank_Name: data.bankName.trim(),
  account_Number: data.accountNumber.trim(),
  swift_Code: data.swiftCode.trim().toUpperCase(),
  country: data.country.trim(),
});

export const beneficiaryApi = {
  getBeneficiaries: async (customerId: string): Promise<Beneficiary[]> => {
    const response = await fetch(`${API_BASE_URL}/api/Beneficiary/customer/${ensureNumericId(customerId, 'Customer ID')}`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as ApiBeneficiaryResponse[];
    return body.map(mapBeneficiary);
  },

  addBeneficiary: async (customerId: string, data: BeneficiaryRequest): Promise<Beneficiary> => {
    const response = await fetch(`${API_BASE_URL}/api/Beneficiary/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(toApiPayload(customerId, data)),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as ApiMutationResponse;

    if (!body.success) {
      throw new Error(body.message || 'Failed to add beneficiary');
    }

    if (!body.beneficiary_Id) {
      throw new Error('Backend did not return the new beneficiary ID');
    }

    return {
      id: String(body.beneficiary_Id),
      ...data,
      swiftCode: data.swiftCode.trim().toUpperCase(),
    };
  },

  updateBeneficiary: async (beneficiaryId: string, data: BeneficiaryRequest): Promise<Beneficiary> => {
    const response = await fetch(`${API_BASE_URL}/api/Beneficiary/update/${ensureNumericId(beneficiaryId, 'Beneficiary ID')}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({
        beneficiary_Name: data.name.trim(),
        bank_Name: data.bankName.trim(),
        account_Number: data.accountNumber.trim(),
        swift_Code: data.swiftCode.trim().toUpperCase(),
        country: data.country.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as ApiMutationResponse;

    if (!body.success) {
      throw new Error(body.message || 'Failed to update beneficiary');
    }

    return {
      id: beneficiaryId,
      ...data,
      swiftCode: data.swiftCode.trim().toUpperCase(),
    };
  },

  deleteBeneficiary: async (beneficiaryId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/Beneficiary/delete/${ensureNumericId(beneficiaryId, 'Beneficiary ID')}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const body = await response.json() as ApiMutationResponse;

    if (!body.success) {
      throw new Error(body.message || 'Failed to delete beneficiary');
    }
  },
};

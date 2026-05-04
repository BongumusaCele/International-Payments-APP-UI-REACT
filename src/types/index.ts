export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  idNumber: string;
  accountNumber: string;
  preferredCurrency?: string;
  phone?: string;
  mfaEnabled: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  swiftCode: string;
  country: string;
  currency: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  beneficiaryId?: string;
  beneficiaryName: string;
  provider: string;
  recipientAccountNumber: string;
  recipientBankName: string;
  swiftCode: string;
  paymentReference: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface LoginRequest {
  username: string;
  accountNumber: string;
  password: string;
}

export interface LoginResult {
  user: User;
  token: string;
  message: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  idNumber: string;
  accountNumber: string;
  preferredCurrency: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone?: string;
}

export interface RegisterResult {
  success: boolean;
  message: string;
  customerId?: number;
  username?: string;
}

export interface PaymentCreateRequest {
  amount: number;
  currency: string;
  provider: string;
  recipientName: string;
  recipientAccountNumber: string;
  recipientBankName: string;
  swiftCode: string;
  paymentReference: string;
}

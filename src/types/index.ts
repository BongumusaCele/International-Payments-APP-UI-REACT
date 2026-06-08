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
  mfaChallengeId: string | null;
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
  currency?: string;
  currencyId?: string;
  createdAt?: string;
}

export interface BeneficiaryRequest {
  name: string;
  accountNumber: string;
  bankName: string;
  swiftCode: string;
  country: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  convertedAmount?: number;
  toCurrency?: string;
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
  user?: User;
  token?: string;
  message: string;
  requiresMfa: boolean;
  mfaChallengeId?: string;
}

export interface VerifyMfaRequest {
  mfaChallengeId: string;
  otpCode: string;
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
  beneficiaryId: string;
  provider: string;
  recipientName: string;
  recipientAccountNumber: string;
  recipientBankName: string;
  swiftCode: string;
  paymentReference: string;
  paymentReason?: string;
}

export interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  pendingCount: number;
  underReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  completedCount: number;
}

export interface EmployeeUser {
  id: string;
  fullName: string;
  email: string;
  employeeNumber: string;
  role: 'Payments Officer' | 'Senior Payments Officer';
  branch: string;
}

export interface EmployeeAuthState {
  user: EmployeeUser | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface EmployeeLoginRequest {
  employeeNumber: string;
  password: string;
}

export interface EmployeePaymentReview {
  id: string;
  paymentReference: string;
  customerName: string;
  customerAccountNumber: string;
  amount: number;
  currency: string;
  beneficiaryName: string;
  recipientAccountNumber: string;
  recipientBankName: string;
  swiftCode: string;
  country: string;
  status: 'Under Review' | 'Verified' | 'Submitted to SWIFT' | 'Rejected';
  createdAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  swiftReference?: string;
  submittedAt?: string;
  verificationNotes?: string;
  rejectionReason?: string;
}

export interface EmployeePaymentSummary {
  underReviewCount: number;
  verifiedCount: number;
  submittedCount: number;
  rejectedCount: number;
}

import {
  EmployeeLoginRequest,
  EmployeePaymentReview,
  EmployeePaymentSummary,
  EmployeeUser,
} from '../types';

interface EmployeeRecord extends EmployeeUser {
  password: string;
}

const employees: EmployeeRecord[] = [
  {
    id: 'emp-001',
    fullName: 'Naledi Mokoena',
    email: 'naledi.mokoena@bank.local',
    employeeNumber: 'EMP001',
    password: 'Password123!',
    role: 'Payments Officer',
    branch: 'Cape Town Operations',
  },
  {
    id: 'emp-002',
    fullName: 'Aiden Jacobs',
    email: 'aiden.jacobs@bank.local',
    employeeNumber: 'EMP002',
    password: 'Password123!',
    role: 'Senior Payments Officer',
    branch: 'Johannesburg Operations',
  },
];

let reviewPayments: EmployeePaymentReview[] = [
  {
    id: 'review-1001',
    paymentReference: 'PAY-20260607-001',
    customerName: 'John Doe',
    customerAccountNumber: '123456789',
    amount: 15000,
    currency: 'ZAR',
    beneficiaryName: 'Anna Schmidt',
    recipientAccountNumber: 'DE89370400440532013000',
    recipientBankName: 'Deutsche Bank',
    swiftCode: 'DEUTDEFF',
    country: 'Germany',
    status: 'Under Review',
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: 'review-1002',
    paymentReference: 'PAY-20260607-002',
    customerName: 'Thandi Ndlovu',
    customerAccountNumber: '887654321',
    amount: 7200,
    currency: 'ZAR',
    beneficiaryName: 'Michael Carter',
    recipientAccountNumber: '9876543210',
    recipientBankName: 'JPMorgan Chase Bank',
    swiftCode: 'CHASUS33',
    country: 'United States',
    status: 'Under Review',
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
  },
  {
    id: 'review-1003',
    paymentReference: 'PAY-20260607-003',
    customerName: 'Priya Naidoo',
    customerAccountNumber: '445566778',
    amount: 32000,
    currency: 'ZAR',
    beneficiaryName: 'Sophie Martin',
    recipientAccountNumber: 'FR7630006000011234567890189',
    recipientBankName: 'BNP Paribas',
    swiftCode: 'BNPAFRPP',
    country: 'France',
    status: 'Verified',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    verifiedBy: 'Naledi Mokoena',
    verifiedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    verificationNotes: 'Beneficiary bank and BIC matched directory record.',
  },
];

const delay = (milliseconds = 350) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const withoutPassword = (employee: EmployeeRecord): EmployeeUser => ({
  id: employee.id,
  fullName: employee.fullName,
  email: employee.email,
  employeeNumber: employee.employeeNumber,
  role: employee.role,
  branch: employee.branch,
});

const getSummary = (payments: EmployeePaymentReview[]): EmployeePaymentSummary => ({
  underReviewCount: payments.filter((payment) => payment.status === 'Under Review').length,
  verifiedCount: payments.filter((payment) => payment.status === 'Verified').length,
  submittedCount: payments.filter((payment) => payment.status === 'Submitted to SWIFT').length,
  rejectedCount: payments.filter((payment) => payment.status === 'Rejected').length,
});

export const employeeMockApi = {
  login: async (data: EmployeeLoginRequest): Promise<EmployeeUser> => {
    await delay();

    const employee = employees.find(
      (item) =>
        item.employeeNumber.toLowerCase() === data.employeeNumber.trim().toLowerCase() &&
        item.password === data.password
    );

    if (!employee) {
      throw new Error('Invalid employee number or password');
    }

    return withoutPassword(employee);
  },

  getPayments: async (): Promise<EmployeePaymentReview[]> => {
    await delay(250);
    return [...reviewPayments];
  },

  getSummary: async (): Promise<EmployeePaymentSummary> => {
    await delay(200);
    return getSummary(reviewPayments);
  },

  verifyPayment: async (
    paymentId: string,
    employee: EmployeeUser
  ): Promise<EmployeePaymentReview> => {
    await delay();

    const payment = reviewPayments.find((item) => item.id === paymentId);
    if (!payment) {
      throw new Error('Transaction not found');
    }

    if (payment.status !== 'Under Review') {
      throw new Error('Only transactions under review can be verified');
    }

    const updatedPayment: EmployeePaymentReview = {
      ...payment,
      status: 'Verified',
      verifiedBy: employee.fullName,
      verifiedAt: new Date().toISOString(),
      verificationNotes: 'Payee account details and SWIFT/BIC code verified.',
    };

    reviewPayments = reviewPayments.map((item) =>
      item.id === paymentId ? updatedPayment : item
    );

    return updatedPayment;
  },

  submitToSwift: async (
    paymentId: string,
    employee: EmployeeUser
  ): Promise<EmployeePaymentReview> => {
    await delay(500);

    const payment = reviewPayments.find((item) => item.id === paymentId);
    if (!payment) {
      throw new Error('Transaction not found');
    }

    if (payment.status !== 'Verified') {
      throw new Error('Transaction must be verified before SWIFT submission');
    }

    const updatedPayment: EmployeePaymentReview = {
      ...payment,
      status: 'Submitted to SWIFT',
      submittedAt: new Date().toISOString(),
      swiftReference: `SWIFT-SIM-${Date.now().toString().slice(-8)}`,
      verificationNotes:
        payment.verificationNotes || `Submitted by ${employee.fullName}`,
    };

    reviewPayments = reviewPayments.map((item) =>
      item.id === paymentId ? updatedPayment : item
    );

    return updatedPayment;
  },
};

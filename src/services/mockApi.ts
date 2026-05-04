import { User, Beneficiary, Payment, LoginRequest, RegisterRequest, PaymentCreateRequest } from '../types';

// Mock data storage
const mockUsers: Map<string, User> = new Map();
const mockPasswords: Map<string, string> = new Map();
const mockBeneficiaries: Map<string, Beneficiary[]> = new Map();
const mockPayments: Map<string, Payment[]> = new Map();
let mockTokenCounter = 1000;

// Pre-populate with test data
const testUser: User = {
  id: 'user-1',
  fullName: 'John Doe',
  email: 'john@example.com',
  username: 'johndoe',
  idNumber: 'ID123456',
  accountNumber: 'ACC001',
  phone: '+1234567890',
  mfaEnabled: false,
  createdAt: new Date().toISOString(),
};

mockUsers.set('johndoe', testUser);
mockPasswords.set('johndoe', 'password');
mockBeneficiaries.set('user-1', [
  {
    id: 'ben-1',
    name: 'Jane Smith',
    accountNumber: 'BEN001',
    bankName: 'Global Bank',
    swiftCode: 'GLBKZAJJ',
    country: 'South Africa',
    currency: 'ZAR',
    createdAt: new Date().toISOString(),
  },
]);
mockPayments.set('user-1', [
  {
    id: 'pay-1',
    amount: 5000,
    currency: 'ZAR',
    beneficiaryId: 'ben-1',
    beneficiaryName: 'Jane Smith',
    provider: 'SWIFT',
    recipientAccountNumber: 'BEN001',
    recipientBankName: 'Global Bank',
    swiftCode: 'GLBKZAJJ',
    paymentReference: 'REF-001',
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'pay-2',
    amount: 2500,
    currency: 'ZAR',
    beneficiaryId: 'ben-1',
    beneficiaryName: 'Jane Smith',
    provider: 'SWIFT',
    recipientAccountNumber: 'BEN001',
    recipientBankName: 'Global Bank',
    swiftCode: 'GLBKZAJJ',
    paymentReference: 'REF-002',
    status: 'Under Review',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
]);

export const mockAuthApi = {
  login: async (data: LoginRequest): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const user = mockUsers.get(data.username);
    const savedPassword = mockPasswords.get(data.username);
    if (!user || user.accountNumber !== data.accountNumber || savedPassword !== data.password) {
      throw new Error('Invalid username, account number, or password');
    }

    const token = `token-${mockTokenCounter++}`;
    return { user, token };
  },

  register: async (data: RegisterRequest): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (mockUsers.has(data.username)) {
      throw new Error('Username already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      username: data.username,
      idNumber: data.idNumber,
      accountNumber: data.accountNumber,
      phone: data.phone,
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
    };

    mockUsers.set(data.username, newUser);
    mockPasswords.set(data.username, data.password);
    mockBeneficiaries.set(newUser.id, []);
    mockPayments.set(newUser.id, []);

    const token = `token-${mockTokenCounter++}`;
    return { user: newUser, token };
  },

  resetPassword: async (username: string, newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = mockUsers.get(username);
    if (!user) {
      throw new Error('User not found');
    }
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    mockPasswords.set(username, newPassword);
  },
};

export const mockBeneficiaryApi = {
  getBeneficiaries: async (userId: string): Promise<Beneficiary[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBeneficiaries.get(userId) || [];
  },

  addBeneficiary: async (userId: string, data: Omit<Beneficiary, 'id' | 'createdAt'>): Promise<Beneficiary> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const beneficiary: Beneficiary = {
      ...data,
      id: `ben-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const beneficiaries = mockBeneficiaries.get(userId) || [];
    beneficiaries.push(beneficiary);
    mockBeneficiaries.set(userId, beneficiaries);

    return beneficiary;
  },

  updateBeneficiary: async (userId: string, beneficiaryId: string, data: Partial<Beneficiary>): Promise<Beneficiary> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const beneficiaries = mockBeneficiaries.get(userId) || [];
    const index = beneficiaries.findIndex(b => b.id === beneficiaryId);

    if (index === -1) {
      throw new Error('Beneficiary not found');
    }

    const updated = { ...beneficiaries[index], ...data };
    beneficiaries[index] = updated;
    mockBeneficiaries.set(userId, beneficiaries);

    return updated;
  },

  deleteBeneficiary: async (userId: string, beneficiaryId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const beneficiaries = mockBeneficiaries.get(userId) || [];
    const filtered = beneficiaries.filter(b => b.id !== beneficiaryId);
    mockBeneficiaries.set(userId, filtered);
  },
};

export const mockPaymentApi = {
  getPayments: async (userId: string): Promise<Payment[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockPayments.get(userId) || [];
  },

  getPaymentById: async (userId: string, paymentId: string): Promise<Payment> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const payments = mockPayments.get(userId) || [];
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  },

  createPayment: async (userId: string, data: PaymentCreateRequest): Promise<Payment> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    if (![...mockUsers.values()].some(user => user.id === userId)) {
      throw new Error('User not found');
    }

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      amount: data.amount,
      currency: data.currency,
      beneficiaryName: data.recipientName,
      provider: data.provider,
      recipientAccountNumber: data.recipientAccountNumber,
      recipientBankName: data.recipientBankName,
      swiftCode: data.swiftCode,
      paymentReference: data.paymentReference,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const payments = mockPayments.get(userId) || [];
    payments.push(payment);
    mockPayments.set(userId, payments);

    return payment;
  },

  updatePaymentStatus: async (userId: string, paymentId: string, status: Payment['status']): Promise<Payment> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const payments = mockPayments.get(userId) || [];
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = status;
    payment.updatedAt = new Date().toISOString();

    return payment;
  },
};

export const mockUserApi = {
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    let user: User | undefined;
    for (const u of mockUsers.values()) {
      if (u.id === userId) {
        user = u;
        break;
      }
    }

    if (!user) {
      throw new Error('User not found');
    }

    const updated = { ...user, ...data };
    mockUsers.set(updated.username, updated);

    return updated;
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    let user: User | undefined;
    for (const u of mockUsers.values()) {
      if (u.id === userId) {
        user = u;
        break;
      }
    }

    if (!user) {
      throw new Error('User not found');
    }

    if (mockPasswords.get(user.username) !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    mockPasswords.set(user.username, newPassword);
  },

  enableMFA: async (userId: string): Promise<{ secret: string; qrCode: string }> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const userExists = [...mockUsers.values()].some(user => user.id === userId);
    if (!userExists) {
      throw new Error('User not found');
    }

    return {
      secret: 'JBSWY3DPEBLW64TMMQ',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    };
  },

  disableMFA: async (userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const userExists = [...mockUsers.values()].some(user => user.id === userId);
    if (!userExists) {
      throw new Error('User not found');
    }
  },
};

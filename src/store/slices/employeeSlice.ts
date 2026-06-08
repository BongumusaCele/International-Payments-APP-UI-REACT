import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  EmployeeAuthState,
  EmployeeLoginRequest,
  EmployeePaymentReview,
  EmployeePaymentSummary,
  EmployeeUser,
} from '../../types';
import { employeeApi } from '../../services/employeeApi';

interface EmployeeState extends EmployeeAuthState {
  payments: EmployeePaymentReview[];
  summary: EmployeePaymentSummary | null;
  paymentsLoading: boolean;
  actionLoadingId: string | null;
}

const readStoredEmployee = (): EmployeeUser | null => {
  const storedEmployee = sessionStorage.getItem('employeeUser');
  if (!storedEmployee) return null;

  try {
    return JSON.parse(storedEmployee) as EmployeeUser;
  } catch {
    sessionStorage.removeItem('employeeUser');
    sessionStorage.removeItem('employeeToken');
    return null;
  }
};

export const employeeLogin = createAsyncThunk(
  'employee/login',
  async (credentials: EmployeeLoginRequest) => {
    const result = await employeeApi.login(credentials);
    sessionStorage.setItem('employeeUser', JSON.stringify(result.employee));
    sessionStorage.setItem('employeeToken', result.token);
    return result;
  }
);

export const employeeLogout = createAsyncThunk('employee/logout', async () => {
  try {
    await employeeApi.logout();
  } finally {
    sessionStorage.removeItem('employeeUser');
    sessionStorage.removeItem('employeeToken');
  }
});

export const fetchEmployeePayments = createAsyncThunk(
  'employee/fetchPayments',
  async () => {
    return await employeeApi.getPayments();
  }
);

export const fetchEmployeePaymentSummary = createAsyncThunk(
  'employee/fetchSummary',
  async () => {
    return await employeeApi.getSummary();
  }
);

export const verifyEmployeePayment = createAsyncThunk(
  'employee/verifyPayment',
  async ({ paymentId }: { paymentId: string }) => {
    return await employeeApi.verifyPayment(paymentId);
  }
);

export const submitEmployeePaymentToSwift = createAsyncThunk(
  'employee/submitToSwift',
  async ({ paymentId }: { paymentId: string }) => {
    return await employeeApi.submitToSwift(paymentId);
  }
);

export const rejectEmployeePayment = createAsyncThunk(
  'employee/rejectPayment',
  async ({
    paymentId,
    rejectionReason,
  }: {
    paymentId: string;
    rejectionReason: string;
  }) => {
    return await employeeApi.rejectPayment(paymentId, rejectionReason);
  }
);

const storedEmployee = readStoredEmployee();
const storedEmployeeToken = sessionStorage.getItem('employeeToken');

const initialState: EmployeeState = {
  user: storedEmployee,
  isAuthenticated: !!storedEmployee && !!storedEmployeeToken,
  token: storedEmployee ? storedEmployeeToken : null,
  loading: false,
  error: null,
  payments: [],
  summary: null,
  paymentsLoading: false,
  actionLoadingId: null,
};

const resetEmployeeSession = (state: EmployeeState) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.error = null;
  state.payments = [];
  state.summary = null;
  state.paymentsLoading = false;
  state.actionLoadingId = null;
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearEmployeeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(employeeLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(employeeLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.employee;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(employeeLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Employee login failed';
      })
      .addCase(employeeLogout.pending, (state) => {
        resetEmployeeSession(state);
      })
      .addCase(employeeLogout.fulfilled, (state) => {
        resetEmployeeSession(state);
      })
      .addCase(employeeLogout.rejected, (state) => {
        resetEmployeeSession(state);
      })
      .addCase(fetchEmployeePayments.pending, (state) => {
        state.paymentsLoading = true;
      })
      .addCase(fetchEmployeePayments.fulfilled, (state, action) => {
        state.paymentsLoading = false;
        state.payments = action.payload;
      })
      .addCase(fetchEmployeePayments.rejected, (state, action) => {
        state.paymentsLoading = false;
        state.error = action.error.message || 'Failed to load employee transactions';
      })
      .addCase(fetchEmployeePaymentSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(verifyEmployeePayment.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg.paymentId;
        state.error = null;
      })
      .addCase(verifyEmployeePayment.fulfilled, (state, action) => {
        state.actionLoadingId = null;
        state.payments = state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        );
        state.summary = null;
      })
      .addCase(verifyEmployeePayment.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.error.message || 'Failed to verify transaction';
      })
      .addCase(submitEmployeePaymentToSwift.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg.paymentId;
        state.error = null;
      })
      .addCase(submitEmployeePaymentToSwift.fulfilled, (state, action) => {
        state.actionLoadingId = null;
        state.payments = state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        );
        state.summary = null;
      })
      .addCase(submitEmployeePaymentToSwift.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.error.message || 'Failed to submit transaction to SWIFT';
      })
      .addCase(rejectEmployeePayment.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg.paymentId;
        state.error = null;
      })
      .addCase(rejectEmployeePayment.fulfilled, (state, action) => {
        state.actionLoadingId = null;
        state.payments = state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        );
        state.summary = null;
      })
      .addCase(rejectEmployeePayment.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.error.message || 'Failed to reject transaction';
      });
  },
});

export const { clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;

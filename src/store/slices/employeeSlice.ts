import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  EmployeeAuthState,
  EmployeeLoginRequest,
  EmployeePaymentReview,
  EmployeePaymentSummary,
  EmployeeUser,
} from '../../types';
import { employeeMockApi } from '../../services/employeeMockApi';

interface EmployeeState extends EmployeeAuthState {
  payments: EmployeePaymentReview[];
  summary: EmployeePaymentSummary | null;
  paymentsLoading: boolean;
  actionLoadingId: string | null;
}

const readStoredEmployee = (): EmployeeUser | null => {
  const storedEmployee = sessionStorage.getItem('employeeUser');
  return storedEmployee ? JSON.parse(storedEmployee) as EmployeeUser : null;
};

export const employeeLogin = createAsyncThunk(
  'employee/login',
  async (credentials: EmployeeLoginRequest) => {
    const employee = await employeeMockApi.login(credentials);
    sessionStorage.setItem('employeeUser', JSON.stringify(employee));
    return employee;
  }
);

export const fetchEmployeePayments = createAsyncThunk(
  'employee/fetchPayments',
  async () => {
    return await employeeMockApi.getPayments();
  }
);

export const fetchEmployeePaymentSummary = createAsyncThunk(
  'employee/fetchSummary',
  async () => {
    return await employeeMockApi.getSummary();
  }
);

export const verifyEmployeePayment = createAsyncThunk(
  'employee/verifyPayment',
  async ({ paymentId, employee }: { paymentId: string; employee: EmployeeUser }) => {
    return await employeeMockApi.verifyPayment(paymentId, employee);
  }
);

export const submitEmployeePaymentToSwift = createAsyncThunk(
  'employee/submitToSwift',
  async ({ paymentId, employee }: { paymentId: string; employee: EmployeeUser }) => {
    return await employeeMockApi.submitToSwift(paymentId, employee);
  }
);

const storedEmployee = readStoredEmployee();

const initialState: EmployeeState = {
  user: storedEmployee,
  isAuthenticated: !!storedEmployee,
  loading: false,
  error: null,
  payments: [],
  summary: null,
  paymentsLoading: false,
  actionLoadingId: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearEmployeeError: (state) => {
      state.error = null;
    },
    employeeLogout: (state) => {
      sessionStorage.removeItem('employeeUser');
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.payments = [];
      state.summary = null;
      state.actionLoadingId = null;
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
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(employeeLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Employee login failed';
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
      });
  },
});

export const { clearEmployeeError, employeeLogout } = employeeSlice.actions;
export default employeeSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Payment, PaymentCreateRequest, PaymentSummary } from '../../types';
import { paymentApi } from '../../services/paymentApi';
import { logout } from './authSlice';

interface PaymentState {
  items: Payment[];
  selectedPayment: Payment | null;
  summary: PaymentSummary | null;
  loading: boolean;
  error: string | null;
}

export const fetchPayments = createAsyncThunk('payments/fetchPayments', async (userId: string) => {
  return await paymentApi.getPayments(userId);
});

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchPaymentById',
  async ({ userId, paymentId }: { userId: string; paymentId: string }) => {
    return await paymentApi.getPaymentById(userId, paymentId);
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async ({ userId, data }: { userId: string; data: PaymentCreateRequest }) => {
    return await paymentApi.createPayment(userId, data);
  }
);

export const fetchPaymentSummary = createAsyncThunk(
  'payments/fetchPaymentSummary',
  async (userId: string) => {
    return await paymentApi.getPaymentSummary(userId);
  }
);

const initialState: PaymentState = {
  items: [],
  selectedPayment: null,
  summary: null,
  loading: false,
  error: null,
};

const resetPaymentState = (state: PaymentState) => {
  state.items = [];
  state.selectedPayment = null;
  state.summary = null;
  state.loading = false;
  state.error = null;
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPayment: (state) => {
      state.selectedPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payments';
      })
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPayment = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payment';
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.summary = null;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create payment';
      })
      .addCase(fetchPaymentSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(fetchPaymentSummary.rejected, (state, action) => {
        state.error = action.error.message || state.error;
      })
      .addCase(logout.pending, (state) => {
        resetPaymentState(state);
      })
      .addCase(logout.fulfilled, (state) => {
        resetPaymentState(state);
      })
      .addCase(logout.rejected, (state) => {
        resetPaymentState(state);
      });
  },
});

export const { clearError, clearSelectedPayment } = paymentSlice.actions;
export default paymentSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Payment, PaymentCreateRequest } from '../../types';
import { mockPaymentApi } from '../../services/mockApi';

interface PaymentState {
  items: Payment[];
  selectedPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

export const fetchPayments = createAsyncThunk('payments/fetchPayments', async (userId: string) => {
  return await mockPaymentApi.getPayments(userId);
});

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchPaymentById',
  async ({ userId, paymentId }: { userId: string; paymentId: string }) => {
    return await mockPaymentApi.getPaymentById(userId, paymentId);
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async ({ userId, data }: { userId: string; data: PaymentCreateRequest }) => {
    return await mockPaymentApi.createPayment(userId, data);
  }
);

const initialState: PaymentState = {
  items: [],
  selectedPayment: null,
  loading: false,
  error: null,
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
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create payment';
      });
  },
});

export const { clearError, clearSelectedPayment } = paymentSlice.actions;
export default paymentSlice.reducer;

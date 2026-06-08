import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Beneficiary, BeneficiaryRequest } from '../../types';
import { beneficiaryApi } from '../../services/beneficiaryApi';
import { logout } from './authSlice';

interface BeneficiaryState {
  items: Beneficiary[];
  loading: boolean;
  error: string | null;
}

export const fetchBeneficiaries = createAsyncThunk(
  'beneficiaries/fetchBeneficiaries',
  async (userId: string) => {
    return await beneficiaryApi.getBeneficiaries(userId);
  }
);

export const addBeneficiary = createAsyncThunk(
  'beneficiaries/addBeneficiary',
  async ({ userId, data }: { userId: string; data: BeneficiaryRequest }) => {
    return await beneficiaryApi.addBeneficiary(userId, data);
  }
);

export const updateBeneficiary = createAsyncThunk(
  'beneficiaries/updateBeneficiary',
  async ({
    beneficiaryId,
    data,
  }: {
    beneficiaryId: string;
    data: BeneficiaryRequest;
  }) => {
    return await beneficiaryApi.updateBeneficiary(beneficiaryId, data);
  }
);

export const deleteBeneficiary = createAsyncThunk(
  'beneficiaries/deleteBeneficiary',
  async (beneficiaryId: string) => {
    await beneficiaryApi.deleteBeneficiary(beneficiaryId);
    return beneficiaryId;
  }
);

const initialState: BeneficiaryState = {
  items: [],
  loading: false,
  error: null,
};

const resetBeneficiaryState = (state: BeneficiaryState) => {
  state.items = [];
  state.loading = false;
  state.error = null;
};

const beneficiarySlice = createSlice({
  name: 'beneficiaries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch beneficiaries';
      })
      .addCase(addBeneficiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBeneficiary.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addBeneficiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add beneficiary';
      })
      .addCase(updateBeneficiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBeneficiary.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateBeneficiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update beneficiary';
      })
      .addCase(deleteBeneficiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBeneficiary.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBeneficiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete beneficiary';
      })
      .addCase(logout.pending, (state) => {
        resetBeneficiaryState(state);
      })
      .addCase(logout.fulfilled, (state) => {
        resetBeneficiaryState(state);
      })
      .addCase(logout.rejected, (state) => {
        resetBeneficiaryState(state);
      });
  },
});

export const { clearError } = beneficiarySlice.actions;
export default beneficiarySlice.reducer;

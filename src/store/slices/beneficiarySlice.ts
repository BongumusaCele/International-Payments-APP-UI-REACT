import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Beneficiary } from '../../types';
import { mockBeneficiaryApi } from '../../services/mockApi';

interface BeneficiaryState {
  items: Beneficiary[];
  loading: boolean;
  error: string | null;
}

export const fetchBeneficiaries = createAsyncThunk(
  'beneficiaries/fetchBeneficiaries',
  async (userId: string) => {
    return await mockBeneficiaryApi.getBeneficiaries(userId);
  }
);

export const addBeneficiary = createAsyncThunk(
  'beneficiaries/addBeneficiary',
  async ({ userId, data }: { userId: string; data: Omit<Beneficiary, 'id' | 'createdAt'> }) => {
    return await mockBeneficiaryApi.addBeneficiary(userId, data);
  }
);

export const updateBeneficiary = createAsyncThunk(
  'beneficiaries/updateBeneficiary',
  async ({
    userId,
    beneficiaryId,
    data,
  }: {
    userId: string;
    beneficiaryId: string;
    data: Partial<Beneficiary>;
  }) => {
    return await mockBeneficiaryApi.updateBeneficiary(userId, beneficiaryId, data);
  }
);

export const deleteBeneficiary = createAsyncThunk(
  'beneficiaries/deleteBeneficiary',
  async ({ userId, beneficiaryId }: { userId: string; beneficiaryId: string }) => {
    await mockBeneficiaryApi.deleteBeneficiary(userId, beneficiaryId);
    return beneficiaryId;
  }
);

const initialState: BeneficiaryState = {
  items: [],
  loading: false,
  error: null,
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
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch beneficiaries';
      })
      .addCase(addBeneficiary.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addBeneficiary.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add beneficiary';
      })
      .addCase(updateBeneficiary.fulfilled, (state, action) => {
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateBeneficiary.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update beneficiary';
      })
      .addCase(deleteBeneficiary.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBeneficiary.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete beneficiary';
      });
  },
});

export const { clearError } = beneficiarySlice.actions;
export default beneficiarySlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import beneficiaryReducer from './slices/beneficiarySlice';
import employeeReducer from './slices/employeeSlice';
import paymentReducer from './slices/paymentSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    beneficiaries: beneficiaryReducer,
    employee: employeeReducer,
    payments: paymentReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

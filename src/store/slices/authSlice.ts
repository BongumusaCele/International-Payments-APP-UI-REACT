import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, AuthState, LoginRequest, RegisterRequest, VerifyMfaRequest } from '../../types';
import { mockUserApi } from '../../services/mockApi';
import { authApi } from '../../services/authApi';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    if (response.token && response.user) {
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }
);

export const verifyMfa = createAsyncThunk(
  'auth/verifyMfa',
  async (data: VerifyMfaRequest) => {
    const response = await authApi.verifyMfa(data);
    if (response.token && response.user) {
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest) => {
    return await authApi.register(data);
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } finally {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, data }: { userId: string; data: Partial<User> }) => {
    const user = await mockUserApi.updateProfile(userId, data);
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({
    userId,
    currentPassword,
    newPassword,
  }: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    await mockUserApi.changePassword(userId, currentPassword, newPassword);
  }
);

const readStoredUser = (): User | null => {
  const storedUser = sessionStorage.getItem('user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    return null;
  }
};

const storedUser = readStoredUser();
const storedToken = sessionStorage.getItem('token');

const initialState: AuthState = {
  user: storedUser,
  isAuthenticated: !!storedUser && !!storedToken,
  token: storedUser ? storedToken : null,
  mfaChallengeId: null,
  loading: false,
  error: null,
};

const resetAuthSession = (state: AuthState) => {
  state.user = null;
  state.token = null;
  state.mfaChallengeId = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.error = null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.mfaChallengeId = action.payload.mfaChallengeId || null;
        if (action.payload.token && action.payload.user) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.mfaChallengeId = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(verifyMfa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMfa.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.isAuthenticated = !!action.payload.token;
        state.mfaChallengeId = null;
      })
      .addCase(verifyMfa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'MFA verification failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload.success ? null : action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(logout.pending, (state) => {
        resetAuthSession(state);
      })
      .addCase(logout.fulfilled, (state) => {
        resetAuthSession(state);
      })
      .addCase(logout.rejected, (state) => {
        resetAuthSession(state);
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Profile update failed';
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Password change failed';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

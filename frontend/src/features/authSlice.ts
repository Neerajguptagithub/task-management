import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types';
import * as authApi from '../api/auth.api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    const res = await authApi.loginUser(credentials).catch((e: Error) => { throw rejectWithValue(e.message); });
    return res.data.data.user;
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: { name: string; email: string; password: string; role?: string }, { rejectWithValue }) => {
    const res = await authApi.registerUser(data).catch((e: Error) => { throw rejectWithValue(e.message); });
    return res.data.data.user;
  }
);

export const fetchMeAsync = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    const res = await authApi.getMe().catch((e: Error) => { throw rejectWithValue(e.message); });
    return res.data.data.user;
  }
);

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  await authApi.logoutUser();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const setLoading = (state: AuthState) => { state.loading = true; state.error = null; };
    const setUser = (state: AuthState, action: { payload: User }) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    };
    const setError = (state: AuthState, action: { payload: unknown }) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(loginAsync.pending, setLoading)
      .addCase(loginAsync.fulfilled, setUser)
      .addCase(loginAsync.rejected, setError)
      .addCase(registerAsync.pending, setLoading)
      .addCase(registerAsync.fulfilled, setUser)
      .addCase(registerAsync.rejected, setError)
      .addCase(fetchMeAsync.pending, setLoading)
      .addCase(fetchMeAsync.fulfilled, setUser)
      .addCase(fetchMeAsync.rejected, (state) => { state.loading = false; })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

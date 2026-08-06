import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, UserState } from '../types';
import * as adminApi from '../api/admin.api';

const initialState: UserState = {
  employees: [],
  loading: false,
  error: null,
};

export const fetchEmployeesAsync = createAsyncThunk('users/fetchEmployees', async () => {
  const res = await adminApi.fetchEmployees();
  return res.data.data.employees;
});

export const createEmployeeAsync = createAsyncThunk(
  'users/createEmployee',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    const res = await adminApi.createEmployee(data).catch((e: Error) => { throw rejectWithValue(e.message); });
    return res.data.data.employee;
  }
);

export const deleteEmployeeAsync = createAsyncThunk(
  'users/deleteEmployee',
  async (id: string, { rejectWithValue }) => {
    await adminApi.deleteEmployee(id).catch((e: Error) => { throw rejectWithValue(e.message); });
    return id;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeesAsync.pending, (state) => { state.loading = true; })
      .addCase(fetchEmployeesAsync.fulfilled, (state, action) => { state.loading = false; state.employees = action.payload; })
      .addCase(fetchEmployeesAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createEmployeeAsync.fulfilled, (state, action) => { state.employees.unshift(action.payload); })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => { state.employees = state.employees.filter((e: User) => e._id !== action.payload); });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;

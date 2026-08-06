import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Task, TaskState, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '../types';
import * as adminApi from '../api/admin.api';
import * as employeeApi from '../api/employee.api';

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchAdminTasksAsync = createAsyncThunk(
  'tasks/fetchAdmin',
  async (params?: Record<string, string>) => {
    const res = await adminApi.fetchAllTasks(params);
    return res.data.data.tasks;
  }
);

export const fetchEmployeeTasksAsync = createAsyncThunk(
  'tasks/fetchEmployee',
  async (params?: Record<string, string>) => {
    const res = await employeeApi.fetchMyTasks(params);
    return res.data.data.tasks;
  }
);

export const createTaskAsync = createAsyncThunk(
  'tasks/create',
  async (data: CreateTaskPayload, { rejectWithValue }) => {
    const res = await adminApi.createTask(data).catch((e: Error) => { throw rejectWithValue(e.message); });
    return res.data.data.task;
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: string; data: UpdateTaskPayload }, { rejectWithValue }) => {
    const res = await adminApi.updateTask(id, data).catch((e: Error) => { throw rejectWithValue(e.message); });
    return res.data.data.task;
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    await adminApi.deleteTask(id).catch((e: Error) => { throw rejectWithValue(e.message); });
    return id;
  }
);

export const updateTaskStatusAsync = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }: { id: string; status: TaskStatus }, { rejectWithValue }) => {
    const res = await employeeApi.updateMyTaskStatus(id, status).catch((e: Error) => { throw rejectWithValue(e.message); });
    return res.data.data.task;
  }
);

const replaceTask = (tasks: Task[], updated: Task) =>
  tasks.map((t: Task) => (t._id === updated._id ? updated : t));

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTasksAsync.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminTasksAsync.fulfilled, (state, action) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchAdminTasksAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchEmployeeTasksAsync.pending, (state) => { state.loading = true; })
      .addCase(fetchEmployeeTasksAsync.fulfilled, (state, action) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchEmployeeTasksAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createTaskAsync.fulfilled, (state, action) => { state.tasks.unshift(action.payload); })
      .addCase(updateTaskAsync.fulfilled, (state, action) => { state.tasks = replaceTask(state.tasks, action.payload); })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => { state.tasks = state.tasks.filter((t) => t._id !== action.payload); })
      .addCase(updateTaskStatusAsync.fulfilled, (state, action) => { state.tasks = replaceTask(state.tasks, action.payload); });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;

import axiosInstance from './axiosInstance';
import type { Task, ApiResponse, TaskStatus } from '../types';

export const fetchMyTasks = (params?: Record<string, string>) =>
  axiosInstance.get<ApiResponse<{ tasks: Task[] }>>('/employee/tasks', { params });

export const updateMyTaskStatus = (id: string, status: TaskStatus) =>
  axiosInstance.patch<ApiResponse<{ task: Task }>>(`/employee/tasks/${id}/status`, { status });

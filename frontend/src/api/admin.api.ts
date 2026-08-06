import axiosInstance from './axiosInstance';
import type { User, Task, DashboardStats, ApiResponse, CreateTaskPayload, UpdateTaskPayload } from '../types';

export const fetchEmployees = () =>
  axiosInstance.get<ApiResponse<{ employees: User[] }>>('/admin/employees');

export const createEmployee = (data: { name: string; email: string; password: string }) =>
  axiosInstance.post<ApiResponse<{ employee: User }>>('/admin/employees', data);

export const deleteEmployee = (id: string) =>
  axiosInstance.delete<ApiResponse<null>>(`/admin/employees/${id}`);

export const fetchAllTasks = (params?: Record<string, string>) =>
  axiosInstance.get<ApiResponse<{ tasks: Task[] }>>('/admin/tasks', { params });

export const createTask = (data: CreateTaskPayload) =>
  axiosInstance.post<ApiResponse<{ task: Task }>>('/admin/tasks', data);

export const updateTask = (id: string, data: UpdateTaskPayload) =>
  axiosInstance.put<ApiResponse<{ task: Task }>>(`/admin/tasks/${id}`, data);

export const deleteTask = (id: string) =>
  axiosInstance.delete<ApiResponse<null>>(`/admin/tasks/${id}`);

export const fetchDashboardStats = () =>
  axiosInstance.get<ApiResponse<DashboardStats>>('/admin/stats');

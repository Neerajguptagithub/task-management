import axiosInstance from './axiosInstance';
import type { User, ApiResponse } from '../types';

export const registerUser = (data: { name: string; email: string; password: string; role?: string }) =>
  axiosInstance.post<ApiResponse<{ user: User }>>('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  axiosInstance.post<ApiResponse<{ user: User }>>('/auth/login', data);

export const logoutUser = () => axiosInstance.post('/auth/logout');

export const getMe = () => axiosInstance.get<ApiResponse<{ user: User }>>('/auth/me');

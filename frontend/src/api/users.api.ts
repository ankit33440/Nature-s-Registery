import { AxiosResponse } from 'axios';
import { User, UserRole } from '../types/user.types';
import axiosInstance from './axios';

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export const usersApi = {
  getAll(
    page = 1,
    limit = 20,
  ): Promise<AxiosResponse<ApiResponse<PaginatedUsers>>> {
    return axiosInstance.get<ApiResponse<PaginatedUsers>>('/users', {
      params: { page, limit },
    });
  },

  updateRole(
    id: string,
    role: UserRole,
  ): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.patch<ApiResponse<User>>(`/users/${id}/role`, { role });
  },

  updateStatus(
    id: string,
    isActive: boolean,
  ): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.patch<ApiResponse<User>>(`/users/${id}/status`, {
      isActive,
    });
  },
};

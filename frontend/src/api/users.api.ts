import { AxiosResponse } from 'axios';
import { User, UserRole, UserStatus } from '../types/user.types';
import axiosInstance from './axios';

interface ApiResponse<T> {
  success: true;
  data: T;
}

interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const usersApi = {
  getAll(params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    status?: UserStatus;
  }): Promise<AxiosResponse<ApiResponse<PaginatedUsers>>> {
    return axiosInstance.get('/users', { params });
  },

  approve(id: string): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.patch(`/users/${id}/approve`);
  },

  reject(id: string, reason?: string): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.patch(`/users/${id}/reject`, { reason });
  },

  create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole.VERIFIER | UserRole.CERTIFIER;
  }): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.post('/users/create', data);
  },

  invite(data: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole.VERIFIER | UserRole.CERTIFIER;
  }): Promise<AxiosResponse<ApiResponse<{ message: string }>>> {
    return axiosInstance.post('/users/invite', data);
  },

  resendInvitation(id: string): Promise<AxiosResponse<ApiResponse<{ message: string }>>> {
    return axiosInstance.post(`/users/invite/${id}/resend`);
  },

  updateStatus(id: string, isActive: boolean): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.patch(`/users/${id}/status`, { isActive });
  },

  updateRole(id: string, role: UserRole): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.patch(`/users/${id}/role`, { role });
  },

  updateMe(data: {
    firstName?: string;
    lastName?: string;
  }): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.patch('/users/me', data);
  },
};

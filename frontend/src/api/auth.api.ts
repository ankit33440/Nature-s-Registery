import { AxiosResponse } from 'axios';
import { AuthTokens, LoginRequest, RefreshResponse, RegisterRequest } from '../types/auth.types';
import { User } from '../types/user.types';
import axiosInstance from './axios';

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export const authApi = {
  register(
    data: RegisterRequest,
  ): Promise<AxiosResponse<ApiResponse<AuthTokens>>> {
    return axiosInstance.post<ApiResponse<AuthTokens>>('/auth/register', data);
  },

  login(data: LoginRequest): Promise<AxiosResponse<ApiResponse<AuthTokens>>> {
    return axiosInstance.post<ApiResponse<AuthTokens>>('/auth/login', data);
  },

  refresh(
    refreshToken: string,
  ): Promise<AxiosResponse<ApiResponse<RefreshResponse>>> {
    return axiosInstance.post<ApiResponse<RefreshResponse>>('/auth/refresh', {
      refreshToken,
    });
  },

  logout(): Promise<AxiosResponse<void>> {
    return axiosInstance.post<void>('/auth/logout');
  },

  getMe(): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.get<ApiResponse<User>>('/users/me');
  },
};

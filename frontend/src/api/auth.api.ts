import { AxiosResponse } from 'axios';
import {
  AcceptInvitationRequest,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
} from '../types/auth.types';
import { User } from '../types/user.types';
import axiosInstance from './axios';

interface ApiResponse<T> {
  success: true;
  data: T;
}

export const authApi = {
  register(data: RegisterRequest): Promise<AxiosResponse<ApiResponse<{ message: string }>>> {
    return axiosInstance.post('/auth/register', data);
  },

  login(data: LoginRequest): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    return axiosInstance.post('/auth/login', data);
  },

  refresh(refreshToken: string): Promise<AxiosResponse<ApiResponse<RefreshResponse>>> {
    return axiosInstance.post('/auth/refresh', { refreshToken });
  },

  acceptInvitation(
    data: AcceptInvitationRequest,
  ): Promise<AxiosResponse<ApiResponse<{ message: string }>>> {
    return axiosInstance.post('/auth/accept-invitation', data);
  },

  logout(): Promise<AxiosResponse<void>> {
    return axiosInstance.post('/auth/logout');
  },

  getMe(): Promise<AxiosResponse<ApiResponse<User>>> {
    return axiosInstance.get('/users/me');
  },
};

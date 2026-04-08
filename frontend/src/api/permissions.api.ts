import { AxiosResponse } from 'axios';
import { Permission } from '../types/rbac.types';
import axiosInstance from './axios';

interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface CreatePermissionPayload {
  name: string;
  key: string;
  resource: string;
  action: string;
  description?: string;
}

export const permissionsApi = {
  getAll(): Promise<AxiosResponse<ApiResponse<Permission[]>>> {
    return axiosInstance.get('/permissions');
  },

  create(
    data: CreatePermissionPayload,
  ): Promise<AxiosResponse<ApiResponse<Permission>>> {
    return axiosInstance.post('/permissions', data);
  },

  update(
    id: string,
    data: Partial<CreatePermissionPayload>,
  ): Promise<AxiosResponse<ApiResponse<Permission>>> {
    return axiosInstance.patch(`/permissions/${id}`, data);
  },

  delete(id: string): Promise<AxiosResponse<void>> {
    return axiosInstance.delete(`/permissions/${id}`);
  },
};

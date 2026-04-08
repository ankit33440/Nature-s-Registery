import { AxiosResponse } from 'axios';
import { Department } from '../types/rbac.types';
import axiosInstance from './axios';

interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface CreateDepartmentPayload {
  name: string;
  slug: string;
  description?: string;
}

export const departmentsApi = {
  getAll(): Promise<AxiosResponse<ApiResponse<Department[]>>> {
    return axiosInstance.get('/departments');
  },

  create(
    data: CreateDepartmentPayload,
  ): Promise<AxiosResponse<ApiResponse<Department>>> {
    return axiosInstance.post('/departments', data);
  },

  update(
    id: string,
    data: Partial<CreateDepartmentPayload>,
  ): Promise<AxiosResponse<ApiResponse<Department>>> {
    return axiosInstance.patch(`/departments/${id}`, data);
  },

  delete(id: string): Promise<AxiosResponse<void>> {
    return axiosInstance.delete(`/departments/${id}`);
  },
};

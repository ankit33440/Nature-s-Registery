import { AxiosResponse } from 'axios';
import { Role } from '../types/rbac.types';
import axiosInstance from './axios';

interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface CreateRolePayload {
  name: string;
  slug: string;
  description?: string;
  permissionIds?: string[];
  departmentIds?: string[];
}

export const rolesApi = {
  getAll(): Promise<AxiosResponse<ApiResponse<Role[]>>> {
    return axiosInstance.get('/roles');
  },

  getById(id: string): Promise<AxiosResponse<ApiResponse<Role>>> {
    return axiosInstance.get(`/roles/${id}`);
  },

  create(data: CreateRolePayload): Promise<AxiosResponse<ApiResponse<Role>>> {
    return axiosInstance.post('/roles', data);
  },

  update(
    id: string,
    data: Partial<CreateRolePayload>,
  ): Promise<AxiosResponse<ApiResponse<Role>>> {
    return axiosInstance.patch(`/roles/${id}`, data);
  },

  delete(id: string): Promise<AxiosResponse<void>> {
    return axiosInstance.delete(`/roles/${id}`);
  },

  setPermissions(
    id: string,
    permissionIds: string[],
  ): Promise<AxiosResponse<ApiResponse<Role>>> {
    return axiosInstance.put(`/roles/${id}/permissions`, { permissionIds });
  },

  setDepartments(
    id: string,
    departmentIds: string[],
  ): Promise<AxiosResponse<ApiResponse<Role>>> {
    return axiosInstance.put(`/roles/${id}/departments`, { departmentIds });
  },
};

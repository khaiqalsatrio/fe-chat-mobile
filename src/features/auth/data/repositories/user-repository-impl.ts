import apiClient from '@/core/services/api-client';
import { User } from '../../domain/entities/user';

export class UserRepository {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get('/users');
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch users');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch user');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }
}

export const userRepository = new UserRepository();

import apiClient from '@/core/services/api-client';
import { AuthResponse, User } from '../../domain/entities/user';
import * as SecureStore from 'expo-secure-store';

export class AuthRepository {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      if (response.data.status === 200) {
        const { token, user } = response.data.data;
        await SecureStore.setItemAsync('auth_token', token);
        await SecureStore.setItemAsync('user_data', JSON.stringify(user));
      }

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        username,
        email,
        password,
      });

      // Token saving removed here to force manual login after registration
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getMe(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch profile');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.log('Backend logout failed or already logged out:', error);
    } finally {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
    }
  }

  async updateProfilePhoto(file: any): Promise<User> {
    try {
      const formData = new FormData();
      // @ts-ignore
      formData.append('file', {
        uri: file.uri,
        name: file.name || 'photo.jpg',
        type: file.type || 'image/jpeg',
      });

      const response = await apiClient.post('/auth/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const user = response.data.data;
      await SecureStore.setItemAsync('user_data', JSON.stringify(user));
      return user;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to update photo');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('auth_token');
    return !!token;
  }
}

export const authRepository = new AuthRepository();

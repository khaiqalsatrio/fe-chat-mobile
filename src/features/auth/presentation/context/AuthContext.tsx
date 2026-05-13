import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../../domain/entities/user';
import { authRepository } from '../../data/repositories/auth-repository-impl';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userDataStr = await SecureStore.getItemAsync('user_data');
      if (userDataStr) {
        setUserState(JSON.parse(userDataStr));
      }
      
      // Only fetch fresh data if we have a token
      const freshUser = await authRepository.getMe();
      if (freshUser) {
        setUserState(freshUser);
        await SecureStore.setItemAsync('user_data', JSON.stringify(freshUser));
      }
    } catch (error) {
      console.log('AuthContext: Failed to load user', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      SecureStore.setItemAsync('user_data', JSON.stringify(newUser));
    } else {
      SecureStore.deleteItemAsync('user_data');
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return;

      const freshUser = await authRepository.getMe();
      setUser(freshUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    await authRepository.logout();
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { authRepository } from '../../data/repositories/auth-repository-impl';

export const useRegister = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = useCallback(async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agree) {
      setError('Please agree to the Terms and Privacy');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Assuming fullName is used as username for now as per repository
      const response = await authRepository.register(fullName, email, password);
      if (response.status === 201 || response.status === 200) {
        router.replace('/login');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [fullName, email, password, confirmPassword, agree, router]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleAgree = useCallback(() => {
    setAgree(prev => !prev);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    agree,
    setAgree,
    isLoading,
    error,
    setError,
    handleRegister,
    toggleShowPassword,
    toggleAgree,
    clearError,
  };
};

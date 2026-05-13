import SettingsPage from '@/features/auth/presentation/pages/SettingsPage';
import { Stack } from 'expo-router';

export default function SettingsRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SettingsPage />
    </>
  );
}

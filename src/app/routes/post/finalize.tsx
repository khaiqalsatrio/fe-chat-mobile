import { Stack } from 'expo-router';
import FinalizePostPage from '@/features/feeds/presentation/pages/FinalizePostPage';

export default function FinalizePostRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FinalizePostPage />
    </>
  );
}

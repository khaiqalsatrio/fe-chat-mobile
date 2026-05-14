import { Stack } from 'expo-router';
import CreatePostPage from '@/features/feeds/presentation/pages/CreatePostPage';

export default function CreatePostRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CreatePostPage />
    </>
  );
}

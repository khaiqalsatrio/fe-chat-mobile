export const getAvatarUrl = (path?: string, fallbackId: string = 'me') => {
  if (!path) return `https://i.pravatar.cc/150?u=${fallbackId}`;
  if (path.startsWith('http')) return path;
  
  // Use 10.0.2.2 for Android emulator to access localhost
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `http://10.0.2.2:8080${cleanPath}`;
};

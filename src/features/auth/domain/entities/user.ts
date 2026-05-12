export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  status: 'ONLINE' | 'OFFLINE';
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

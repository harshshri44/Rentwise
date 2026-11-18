export type UserRole = 'OWNER' | 'TENANT' | 'ADMIN';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: UserProfile;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'OWNER' | 'TENANT';
}

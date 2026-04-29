import type { UserRole } from '../users';

export interface LoginResponse {
  id: string;
  nickname: string;
  email: string;
  role: UserRole;
  token: string;
}

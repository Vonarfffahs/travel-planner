import type { UserRole } from './userRole.type';

export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  role: UserRole;
}

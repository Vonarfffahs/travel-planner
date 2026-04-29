import type { UserRole } from './userRole.type';
import type { UserStatus } from './userStatus.type';

export interface User {
  id: string;
  nickname: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

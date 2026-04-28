export type UserRole = 'USER' | 'ADMIN';

export interface User {
  username: string;
  nickname: string;
  email: string;
  profilePic: string;
  role: UserRole;
}

export type UserRole = 'readOnly' | 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  picture: string;
  email: string;
  credential: string;
  userRole: UserRole;
}

export const anonymous: User = Object.freeze({
  credential: '',
  email: '',
  id: 0,
  picture: '',
  name: "anonymous",
  userRole: 'readOnly'
});

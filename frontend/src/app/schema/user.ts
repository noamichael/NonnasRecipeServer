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
  credential: null,
  email: null,
  id: 0,
  picture: null,
  name: "anonymous",
  userRole: 'readOnly'
});

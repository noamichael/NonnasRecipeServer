export interface User {
  id: number;
  name: string;
  picture: string;
  email: string;
  credential: string;
}

export const anonymous: User = Object.freeze({
  credential: null,
  email: null,
  id: 0,
  picture: null,
  name: "anonymous",
});

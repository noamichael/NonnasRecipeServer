export interface User {
  id: string;
  name: string;
  picture: string;
  email: string;
  credential: string;
}

export const anonymous: User = Object.freeze({
  credential: null,
  email: null,
  id: "anonymous",
  picture: null,
  name: "anonymous",
});

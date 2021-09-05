export interface User {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  credential: string;
}

export const anonymous: User = Object.freeze({
  credential: null,
  email: null,
  id: "anonymous",
  imageUrl: null,
  name: "anonymous",
});

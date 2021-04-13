export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export interface User extends RegisterInput {
  createdAt: string;
}

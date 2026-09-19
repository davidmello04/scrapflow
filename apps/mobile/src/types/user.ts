export type UserRole = 'ADMIN' | 'OPERATOR';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = { accessToken: string; user: AuthUser };

export type ManagedUser = AuthUser & {
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

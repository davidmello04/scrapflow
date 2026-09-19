export type UserRole = 'ADMIN' | 'OPERATOR';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = { accessToken: string; user: AuthUser };

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface BackendAuthUser {
  _id: string;
  username: string;
  email: string;
}

export interface BackendAuthPayload {
  token: string;
  user: BackendAuthUser;
}

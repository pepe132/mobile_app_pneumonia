export type RoleId = 1 | 2 | 3;

export type AuthUser = {
  user_id: string;
  user_name: string;
  email: string;
  role_id: RoleId;
  role_name: string | null;
  active: boolean;
  created_at: string;
  updated_at: string | null;
};

export type LoginPayload = { email: string; user_password: string };

export type TokenResponse = {
  access_token: string;
  token_type: 'bearer';
  user: AuthUser;
};

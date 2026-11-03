import { apiRequest } from '../../api/client';
import type { AuthUser, LoginPayload, TokenResponse } from './types';

export const authApi = {
  login: (payload: LoginPayload) => apiRequest<TokenResponse>('/auth/login', {
    method: 'POST', authenticated: false, body: payload,
  }),
  me: () => apiRequest<AuthUser>('/auth/me'),
};

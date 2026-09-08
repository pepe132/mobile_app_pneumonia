import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { sessionStorage } from '../../storage/sessionStorage';
import { authApi } from './api';
import type { AuthUser, LoginPayload } from './types';

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';
type SessionContextValue = {
  status: SessionStatus;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  const logout = useCallback(async () => {
    await sessionStorage.clearAccessToken();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    await sessionStorage.setAccessToken(response.access_token);
    setUser(response.user);
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      const token = await sessionStorage.getAccessToken();
      if (!token) {
        if (active) setStatus('unauthenticated');
        return;
      }
      try {
        const currentUser = await authApi.me();
        if (active) { setUser(currentUser); setStatus('authenticated'); }
      } catch {
        await sessionStorage.clearAccessToken();
        if (active) { setUser(null); setStatus('unauthenticated'); }
      }
    }
    void restoreSession();
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({ status, user, login, logout }), [login, logout, status, user]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession debe usarse dentro de SessionProvider.');
  return context;
}

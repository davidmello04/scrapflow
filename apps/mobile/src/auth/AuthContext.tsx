import * as SecureStore from 'expo-secure-store';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth';
import { setAccessToken, setUnauthorizedHandler } from '../services/api';
import type { AuthUser } from '../types/user';

const TOKEN_KEY = 'scrapflow_access_token';
type AuthContextValue = {
  user?: AuthUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restore() {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!token) return;
        setAccessToken(token);
        setUser(await authService.me());
      } catch {
        setAccessToken(undefined);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    }
    void restore();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAccessToken(undefined);
      setUser(undefined);
      void SecureStore.deleteItemAsync(TOKEN_KEY);
    });
    return () => setUnauthorizedHandler(undefined);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: async (email, password) => {
      const result = await authService.login(email, password);
      await SecureStore.setItemAsync(TOKEN_KEY, result.accessToken);
      setAccessToken(result.accessToken);
      setUser(result.user);
    },
    logout: async () => {
      setAccessToken(undefined);
      setUser(undefined);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    },
    changePassword: async (currentPassword, newPassword) => {
      await authService.changePassword(currentPassword, newPassword);
      setAccessToken(undefined);
      setUser(undefined);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}

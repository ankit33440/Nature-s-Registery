import axios from 'axios';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authApi } from '../api/auth.api';
import { LoginRequest, RegisterRequest } from '../types/auth.types';
import { User } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken'),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authApi
        .getMe()
        .then((res) => {
          setUser(res.data.data);
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAccessToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginRequest): Promise<void> => {
    const res = await authApi.login(data);
    const { accessToken: at, refreshToken: rt, user: u } = res.data.data;
    localStorage.setItem('accessToken', at);
    localStorage.setItem('refreshToken', rt);
    setAccessToken(at);
    // Login response already includes user — no need for a second /users/me call
    const meRes = await authApi.getMe();
    setUser(meRes.data.data);
    void u; // user from login is partial; getMe returns full entity
  };

  // Register does NOT log in — returns a message and stops.
  // The caller is responsible for showing the success screen.
  const register = async (data: RegisterRequest): Promise<void> => {
    await authApi.register(data);
    // no token storage — account is PENDING_APPROVAL
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (err) {
      if (!axios.isAxiosError(err) || err.response?.status !== 401) {
        throw err;
      }
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

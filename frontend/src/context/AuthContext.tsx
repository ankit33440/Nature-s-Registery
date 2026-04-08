import axios from 'axios';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authApi } from '../api/auth.api';
import { usersApi } from '../api/users.api';
import { LoginRequest, RegisterRequest } from '../types/auth.types';
import { User } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  permissions: string[];
  accessToken: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Fire-and-forget: fetch the user's dynamic permission keys and update state. */
async function fetchPermissions(
  setPermissions: (p: string[]) => void,
): Promise<void> {
  try {
    const res = await usersApi.getMyPermissions();
    setPermissions(res.data.data);
  } catch {
    setPermissions([]);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
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
          void fetchPermissions(setPermissions);
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
    void u;
    const meRes = await authApi.getMe();
    setUser(meRes.data.data);
    void fetchPermissions(setPermissions);
  };

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
      setPermissions([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, permissions, accessToken, isLoading, login, register, logout }}
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

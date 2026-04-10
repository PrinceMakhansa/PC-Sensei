import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { authLogin, authRegister, authGetMe, authUpdateProfile } from "../api/auth";

const TOKEN_KEY = "pcsensei_token";

const AuthContext = createContext(null);

/** Decode a JWT payload without verifying the signature (client-side only). */
function parseJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { id, name, email, role }
  const [loading, setLoading] = useState(true); // true while checking existing token on mount

  // On mount — restore session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authGetMe()
      .then(setUser)
      .catch((err) => {
        // Only clear the token on proper auth errors (401/403).
        // Network errors or server-down should NOT log the user out.
        const msg = err?.message || '';
        const isAuthError =
          msg.includes('401') ||
          msg.includes('403') ||
          msg.toLowerCase().includes('unauthorized') ||
          msg.toLowerCase().includes('forbidden') ||
          msg.toLowerCase().includes('invalid token') ||
          msg.toLowerCase().includes('jwt');

        if (isAuthError) {
          localStorage.removeItem(TOKEN_KEY);
        } else {
          // Server unreachable — restore user from JWT payload so the route guard passes.
          const payload = parseJwtPayload(token);
          if (payload) {
            setUser({
              id: payload.id || payload.sub,
              name: payload.name || 'User',
              email: payload.email || '',
              role: payload.role || 'user',
            });
          } else {
            localStorage.removeItem(TOKEN_KEY);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authLogin({ email, password });
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authRegister({ name, email, password });
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const updated = await authUpdateProfile(data);
    setUser(updated);
    return updated;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
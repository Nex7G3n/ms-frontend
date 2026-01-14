import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/user';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone: string }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<Omit<User, 'id' | 'password'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = async (email: string, password: string) => {
    const session = authService.login({ email, password });
    setUser(session.user);
    
    // Migrar carrito de invitado a usuario
    const { cartService } = await import('../services/cartService');
    cartService.migrateGuestCart(session.user.id);
    
    // Disparar evento para actualizar CartContext
    setTimeout(() => window.dispatchEvent(new Event('userSessionChange')), 100);
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; phone: string }) => {
    const newUser = authService.register(data);
    const session = authService.login({ email: data.email, password: data.password });
    setUser(session.user);
    
    // Migrar carrito de invitado a usuario
    const { cartService } = await import('../services/cartService');
    cartService.migrateGuestCart(session.user.id);
    
    // Disparar evento para actualizar CartContext
    setTimeout(() => window.dispatchEvent(new Event('userSessionChange')), 100);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Disparar evento para actualizar CartContext
    window.dispatchEvent(new Event('userSessionChange'));
  };

  const updateUser = async (updates: Partial<Omit<User, 'id' | 'password'>>) => {
    if (!user) throw new Error('Usuario no autenticado');
    const updatedUser = authService.updateUser(user.id, updates);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

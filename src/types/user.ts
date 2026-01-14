import type { Address, Client } from './models';

export interface User {
  id: number;
  email: string;
  password: string; // Solo para simulación, en producción nunca se guarda
  firstName: string;
  lastName: string;
  phone: string;
  role?: 'admin' | 'customer'; // Rol del usuario
  addresses?: Address[];
  createdAt: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserSession {
  user: Omit<User, 'password'>;
  token: string;
  expiresAt: number;
}

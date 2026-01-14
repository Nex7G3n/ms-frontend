import type { User, RegisterDTO, LoginDTO, UserSession } from '../types/user';

const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const SESSION_KEY = 'userSession';

// Inicializar usuarios de ejemplo si no existen
const initializeUsers = (): User[] => {
  const existing = localStorage.getItem(USERS_STORAGE_KEY);
  let users: User[] = [];
  
  if (existing) {
    try {
      users = JSON.parse(existing);
      // Actualizar usuarios existentes que no tengan rol
      let needsUpdate = false;
      users = users.map(user => {
        if (!user.role) {
          needsUpdate = true;
          // Asignar rol según email
          if (user.email === 'admin@autoparts.com') {
            return { ...user, role: 'admin' };
          }
          return { ...user, role: 'customer' };
        }
        return user;
      });
      
      // Asegurar que el admin tenga rol admin
      const adminIndex = users.findIndex(u => u.email === 'admin@autoparts.com');
      if (adminIndex >= 0 && users[adminIndex].role !== 'admin') {
        users[adminIndex].role = 'admin';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }
      
      return users;
    } catch {
      // Si hay error al parsear, crear usuarios por defecto
    }
  }

  const defaultUsers: User[] = [
    {
      id: 1,
      email: 'admin@autoparts.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '999999999',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      email: 'cliente@example.com',
      password: 'cliente123',
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '987654321',
      role: 'customer',
      createdAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const authService = {
  // Inicializar usuarios
  initialize(): void {
    initializeUsers();
  },

  // Registrar nuevo usuario
  register(data: RegisterDTO): User {
    const users = this.getAllUsers();
    
    // Verificar si el email ya existe
    if (users.some(u => u.email === data.email)) {
      throw new Error('El email ya está registrado');
    }

    const newUser: User = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    return newUser;
  },

  // Login
  login(data: LoginDTO): UserSession {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === data.email && u.password === data.password);

    if (!user) {
      throw new Error('Email o contraseña incorrectos');
    }

    const session: UserSession = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        createdAt: user.createdAt,
      },
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session.user));
    
    return session;
  },

  // Logout
  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Obtener usuario actual
  getCurrentUser(): Omit<User, 'password'> | null {
    const sessionJson = localStorage.getItem(SESSION_KEY);
    if (!sessionJson) return null;

    try {
      const session: UserSession = JSON.parse(sessionJson);
      
      // Verificar si la sesión expiró
      if (session.expiresAt < Date.now()) {
        this.logout();
        return null;
      }

      return session.user;
    } catch {
      return null;
    }
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  // Verificar si es administrador
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },

  // Obtener todos los usuarios (solo para desarrollo)
  getAllUsers(): User[] {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    if (!usersJson) {
      return initializeUsers();
    }
    return JSON.parse(usersJson);
  },

  // Actualizar usuario
  updateUser(userId: number, updates: Partial<Omit<User, 'id' | 'password'>>): Omit<User, 'password'> {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const updatedUser = { ...users[userIndex] };
    delete (updatedUser as any).password;

    // Actualizar sesión si es el usuario actual
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const session: UserSession = {
        user: updatedUser,
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }

    return updatedUser;
  },
};

// Inicializar al cargar el módulo
authService.initialize();

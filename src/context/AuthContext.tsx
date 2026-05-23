import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'admin' | 'staff' | 'viewer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
}

const USERS: (AuthUser & { password: string })[] = [
  {
    id: 'USR-001',
    name: 'Admin',
    email: 'admin@rrenterprises.in',
    password: 'admin@123',
    role: 'admin',
    avatar: 'AD',
  },
  {
    id: 'USR-002',
    name: 'Arjun Mehta',
    email: 'arjun@rrenterprises.in',
    password: 'staff@123',
    role: 'staff',
    avatar: 'AM',
  },
  {
    id: 'USR-003',
    name: 'Kavita Rao',
    email: 'kavita@rrenterprises.in',
    password: 'staff@123',
    role: 'staff',
    avatar: 'KR',
  },
  {
    id: 'USR-004',
    name: 'Viewer',
    email: 'view@rrenterprises.in',
    password: 'view@123',
    role: 'viewer',
    avatar: 'VW',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string) => {
    const found = USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const { password: _pw, ...authUser } = found;
      setUser(authUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password. Please try again.' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isStaff: user?.role === 'admin' || user?.role === 'staff',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/data/types';
import { mockUser } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  enrollInCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('erudition-user');
    if (!stored) return null;

    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem('erudition-user');
      return null;
    }
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('erudition-admin') === 'true';
  });

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setIsAdmin(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const adminLogin = (email: string, password: string) => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return false;
    }

    if (email === adminEmail && password === adminPassword) {
      setIsAdmin(true);
      setUser({ ...mockUser, name: 'Admin', email });
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setIsAdmin(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('erudition-user');
      localStorage.removeItem('erudition-admin');
    }
  };

  const enrollInCourse = (courseId: string) => {
    if (user && !user.enrolledCourses.includes(courseId)) {
      setUser({ ...user, enrolledCourses: [...user.enrolledCourses, courseId], progress: { ...user.progress, [courseId]: 0 } });
    }
  };

  const updateProgress = (courseId: string, progress: number) => {
    if (user) setUser({ ...user, progress: { ...user.progress, [courseId]: progress } });
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem('erudition-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('erudition-user');
    }
  }, [user]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('erudition-admin', String(isAdmin));
  }, [isAdmin]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, adminLogin, register, logout, enrollInCourse, updateProgress, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

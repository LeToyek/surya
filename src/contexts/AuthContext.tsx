// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthenticatedUser, Role } from '../types';
import { useRouter } from 'next/navigation'; // Using next/navigation for App Router

// --- Mock User Data Store (replace with API calls later) ---
// For simplicity, store users in localStorage. In a real app, this is insecure.
const MOCK_USERS_DB_KEY = 'mockSolarUsersDB';

const getMockUsers = (): AuthenticatedUser[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(MOCK_USERS_DB_KEY);
  return users ? JSON.parse(users) : [];
};

const saveMockUsers = (users: AuthenticatedUser[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
};
// --- End Mock User Data Store ---


interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password_UNUSED: string) => Promise<boolean>; // password_UNUSED for mock
  logout: () => void;
  register: (name: string, email: string, password_UNUSED: string, role?: Role) => Promise<boolean>;
  // Will add admin user creation here for testing
  createAdminUserIfNotExists: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // To handle initial auth check
  const router = useRouter();

  const createAdminUserIfNotExists = useCallback(() => {
    const users = getMockUsers();
    const adminExists = users.some(u => u.email === 'admin@solarschools.dev' && u.role === 'ADMIN');
    if (!adminExists) {
      const adminUser: AuthenticatedUser = {
        id: 'admin001',
        name: 'Admin User',
        email: 'admin@solarschools.dev',
        role: 'ADMIN',
      };
      // For mock, password isn't stored/checked, but real registration would hash it.
      users.push(adminUser);
      saveMockUsers(users);
      console.log('Mock admin user created: admin@solarschools.dev');
    }
  }, []);


  // Check for persisted user on mount
  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem('currentUser');
        }
      }
      // Ensure mock admin exists for testing
      createAdminUserIfNotExists();
    }
    setIsLoading(false);
  }, [createAdminUserIfNotExists]);

  const login = async (email: string, password_UNUSED: string): Promise<boolean> => {
    setIsLoading(true);
    console.log(`Attempting login for: ${email}`); // Mock password validation
    const users = getMockUsers();
    const foundUser = users.find(u => u.email === email); // In real app, also check hashed password

    if (foundUser) {
      setUser(foundUser);
      console.log("User found:", foundUser,password_UNUSED);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      console.log('Login successful:', foundUser);
      setIsLoading(false);
      return true;
    }
    console.log('Login failed: User not found or password incorrect (mock).');
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    router.push('/login'); // Redirect to login after logout
    console.log('User logged out.');
  };

  const register = async (name: string, email: string, password_UNUSED: string, role: Role = 'USER'): Promise<boolean> => {
    setIsLoading(true);
    const users = getMockUsers();
    if (users.find(u => u.email === email)) {
      console.log('Registration failed: Email already exists.');
      setIsLoading(false);
      return false; // Email already exists
    }
    const newUser: AuthenticatedUser = {
      id: `user-${Date.now()}`, // Simple unique ID
      name,
      email,
      role,
    };
    users.push(newUser);
    saveMockUsers(users);
    // Optionally log in the user directly after registration
    // setUser(newUser);
    // localStorage.setItem('currentUser', JSON.stringify(newUser));
    console.log('Registration successful:', newUser);
    setIsLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register, createAdminUserIfNotExists }}>
      {children}
    </AuthContext.Provider>
  );
};
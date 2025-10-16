import React, { createContext, useContext } from 'react';

interface AuthValue {
  user?: any;
  role?: string;
  permissions?: string[] | Record<string, any>;
}

const AuthContext = createContext<AuthValue>({ user: undefined, role: undefined, permissions: [] });

export const AuthProvider = ({ children, value }: { children: React.ReactNode; value?: AuthValue }) => {
  const { user, role, permissions } = value || {};

  return (
    <AuthContext.Provider value={{ user, role, permissions: permissions ?? [] }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

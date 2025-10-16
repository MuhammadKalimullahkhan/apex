import React from 'react';
import { useAuth } from '@/contexts/auth-context';

interface RoleGuardProps {
  allow: string[]; // e.g., ['Admin', 'HR']
  children: React.ReactNode;
}

export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const auth = useAuth();
  const role = auth?.role as string | undefined;

  if (!role) return null;
  

  return allow.includes(role) ? <>{children}</> : null;
}

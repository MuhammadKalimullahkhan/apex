// guards/permission-guard.tsx
import React from 'react';
import { useAuth } from '@/contexts/auth-context';

interface PermissionGuardProps {
  permission?: string | string[];
  children: React.ReactNode;
}

export default function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const auth = useAuth();

  if (!permission) return <>{children}</>; // No permission required

  const userPermissionsRaw = auth?.permissions ?? '[]';

  let userPermissions: string[] = [];

  try {
    userPermissions = JSON.parse(userPermissionsRaw);
  } catch {
    // fallback in case of invalid JSON
    userPermissions = [];
  }

  const requiredPermissions = Array.isArray(permission) ? permission : [permission];

  // Check for exact or wildcard match
  const hasPermission = requiredPermissions.some((perm) => {
    if (userPermissions.includes(perm)) return true;

    const prefix = perm.split('.')[0];
    return userPermissions.includes(`${prefix}.*`);
  });

  return hasPermission ? <>{children}</> : null;
}

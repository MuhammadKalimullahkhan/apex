import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useAuth } from '@/contexts/auth-context';

export default function useRoleGuard(allow: string[]) {
  const { role } = useAuth();

  useEffect(() => {
    if (role && !allow.includes(role)) {
      router.visit('/unauthorized');
    }
  }, [role]);
}

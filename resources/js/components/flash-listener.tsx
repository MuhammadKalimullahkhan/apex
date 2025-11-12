import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { ExternalToast, toast } from 'sonner'

export function FlashListener() {
  const { flash } = usePage().props as any;
  const commonProps: ExternalToast = {
    duration: 5000,
    position: 'top-right',
  };

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success, { ...commonProps })
    }
    if (flash?.error) {
      toast.error(flash.error, { ...commonProps })
    }
    if (flash?.warning) {
      toast.warning(flash.warning, { ...commonProps })
    }
    if (flash?.info) {
      toast.info(flash.info, { ...commonProps })
    }
  }, [flash])

  return null
}


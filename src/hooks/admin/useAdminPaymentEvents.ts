'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminPaymentEvents } from '@/services/admin/adminPaymentService';

export function useAdminPaymentEvents(paymentId: number | null) {
  return useQuery({
    queryKey: ['admin', 'payment-events', paymentId],
    queryFn: () => getAdminPaymentEvents(paymentId as number),
    enabled: paymentId != null,
    staleTime: 60_000,
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminPaymentEvents } from '@/services/admin/adminPaymentService';
import { adminKeys } from './queryKeys';

export function useAdminPaymentEvents(paymentId: number | null) {
  return useQuery({
    queryKey: adminKeys.paymentEvents(paymentId),
    queryFn: () => getAdminPaymentEvents(paymentId as number),
    enabled: paymentId != null,
    staleTime: 60_000,
  });
}

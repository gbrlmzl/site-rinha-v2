'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listAdminTournamentPayments } from '@/services/admin/adminPaymentService';
import type { PaymentStatus } from '@/types/admin/payment';
import { adminKeys } from './queryKeys';

export interface AdminTournamentPaymentsParams {
  tournamentId: number;
  status?: PaymentStatus;
  page: number;
  size: number;
}

export function useAdminTournamentPayments(params: AdminTournamentPaymentsParams) {
  return useQuery({
    queryKey: adminKeys.tournamentPaymentsList(params),
    queryFn: () => listAdminTournamentPayments(params),
    placeholderData: keepPreviousData,
    enabled: Number.isFinite(params.tournamentId),
  });
}

'use client';

import { apiFetch } from '@/services/interceptor';
import { buildApiUrl, parseOrThrow } from '@/services/http';
import type {
  AdminPaymentEvent,
  AdminPaymentSummary,
  PaymentStatus,
} from '@/types/admin/payment';
import type { Page } from '@/types/admin/tournament';

interface ListTournamentPaymentsParams {
  tournamentId: number;
  status?: PaymentStatus;
  page?: number;
  size?: number;
}

export async function listAdminTournamentPayments(
  params: ListTournamentPaymentsParams
): Promise<Page<AdminPaymentSummary>> {
  const url = buildApiUrl(`/admin/tournaments/${params.tournamentId}/payments`, {
    status: params.status,
    page: params.page?.toString(),
    size: params.size?.toString(),
  });
  const response = await apiFetch(url, { method: 'GET' });
  return parseOrThrow<Page<AdminPaymentSummary>>(response);
}

export async function getAdminPaymentEvents(
  paymentId: number
): Promise<AdminPaymentEvent[]> {
  const response = await apiFetch(
    buildApiUrl(`/admin/payments/${paymentId}/events`),
    { method: 'GET' }
  );
  return parseOrThrow<AdminPaymentEvent[]>(response);
}

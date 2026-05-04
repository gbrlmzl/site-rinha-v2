'use client';

import { apiFetch } from '@/services/interceptor';
import { buildApiUrl, parseOrThrow } from '@/services/http';
import type { Page } from '@/types/admin/tournament';
import type { AdminTeamSummary, TeamStatus } from '@/types/admin/team';
import type { AdminPaymentSummary } from '@/types/admin/payment';

interface ListTeamsParams {
  tournamentId: number;
  statusList?: TeamStatus[];
  page?: number;
  size?: number;
  sort?: string;
}

export async function listAdminTournamentTeams(
  params: ListTeamsParams
): Promise<Page<AdminTeamSummary>> {
  const url = buildApiUrl(
    `/admin/tournaments/${params.tournamentId}/teams`,
    {
      statusList: params.statusList?.join(','),
      page: params.page?.toString(),
      size: params.size?.toString(),
      sort: params.sort,
    }
  );
  const response = await apiFetch(url, { method: 'GET' });
  return parseOrThrow<Page<AdminTeamSummary>>(response);
}

export async function banAdminTeam(
  tournamentId: number,
  teamId: number
): Promise<void> {
  const response = await apiFetch(
    buildApiUrl(`/admin/tournaments/${tournamentId}/teams/${teamId}`),
    { method: 'PATCH' }
  );
  await parseOrThrow<void>(response);
}

interface ListTeamPaymentsParams {
  tournamentId: number;
  teamId: number;
  page?: number;
  size?: number;
}

export async function listAdminTeamPayments(
  params: ListTeamPaymentsParams
): Promise<Page<AdminPaymentSummary>> {
  const url = buildApiUrl(
    `/admin/tournaments/${params.tournamentId}/teams/${params.teamId}/payments`,
    {
      page: params.page?.toString(),
      size: params.size?.toString(),
    }
  );
  const response = await apiFetch(url, { method: 'GET' });
  return parseOrThrow<Page<AdminPaymentSummary>>(response);
}

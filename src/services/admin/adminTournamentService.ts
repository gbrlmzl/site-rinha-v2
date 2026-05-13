'use client';

import { apiFetch } from '@/services/interceptor';
import { buildApiUrl, parseOrThrow } from '@/services/http';
import type {
  AdminTournamentDetail,
  AdminTournamentSummary,
  GameType,
  Page,
} from '@/types/admin/tournament';

const BASE = '/admin/tournaments';

interface ListTournamentsParams {
  game?: GameType;
  page?: number;
  size?: number;
  sort?: string;
}

export async function listAdminTournaments(
  params: ListTournamentsParams = {}
): Promise<Page<AdminTournamentSummary>> {
  const url = buildApiUrl(BASE, {
    game: params.game,
    page: params.page?.toString(),
    size: params.size?.toString(),
    sort: params.sort,
  });
  const response = await apiFetch(url, { method: 'GET' });
  return parseOrThrow<Page<AdminTournamentSummary>>(response);
}

export async function getAdminTournamentById(
  tournamentId: number
): Promise<AdminTournamentDetail> {
  const response = await apiFetch(buildApiUrl(`${BASE}/${tournamentId}`), { method: 'GET' });
  return parseOrThrow<AdminTournamentDetail>(response);
}

export async function createAdminTournament(
  formData: FormData
): Promise<AdminTournamentDetail> {
  const response = await apiFetch(buildApiUrl(BASE), {
    method: 'POST',
    body: formData,
  });
  return parseOrThrow<AdminTournamentDetail>(response);
}

export async function updateAdminTournament(
  tournamentId: number,
  formData: FormData
): Promise<AdminTournamentDetail> {
  const response = await apiFetch(buildApiUrl(`${BASE}/${tournamentId}`), {
    method: 'PUT',
    body: formData,
  });
  return parseOrThrow<AdminTournamentDetail>(response);
}

export async function cancelAdminTournament(
  tournamentId: number,
  force: boolean
): Promise<void> {
  const url = buildApiUrl(`${BASE}/${tournamentId}`, { force: String(force) });
  const response = await apiFetch(url, { method: 'PATCH' });
  await parseOrThrow<void>(response);
}

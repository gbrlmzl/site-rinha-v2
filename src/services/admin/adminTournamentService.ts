'use client';

import { apiFetch } from '@/services/interceptor';
import type {
  AdminTournamentDetail,
  AdminTournamentSummary,
  SpringPage,
  TournamentGame,
} from '@/types/admin/tournament';

const ADMIN_TOURNAMENTS_PATH = '/admin/tournaments';

interface ListTournamentsParams {
  game?: TournamentGame;
  page?: number;
  size?: number;
  sort?: string;
}

function buildUrl(path: string, params: Record<string, string | undefined>) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const url = new URL(`${baseUrl}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function parseOrThrow<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.message ?? errorBody?.error ?? `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function listAdminTournaments(
  params: ListTournamentsParams = {}
): Promise<SpringPage<AdminTournamentSummary>> {
  const url = buildUrl(ADMIN_TOURNAMENTS_PATH, {
    game: params.game,
    page: params.page?.toString(),
    size: params.size?.toString(),
    sort: params.sort,
  });

  const response = await apiFetch(url, { method: 'GET' });
  return parseOrThrow<SpringPage<AdminTournamentSummary>>(response);
}

export async function getAdminTournamentById(
  tournamentId: number
): Promise<AdminTournamentDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const response = await apiFetch(
    `${baseUrl}${ADMIN_TOURNAMENTS_PATH}/${tournamentId}`,
    { method: 'GET' }
  );
  return parseOrThrow<AdminTournamentDetail>(response);
}

export async function createAdminTournament(
  formData: FormData
): Promise<AdminTournamentDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const response = await apiFetch(`${baseUrl}${ADMIN_TOURNAMENTS_PATH}`, {
    method: 'POST',
    body: formData,
  });
  return parseOrThrow<AdminTournamentDetail>(response);
}

export async function updateAdminTournament(
  tournamentId: number,
  formData: FormData
): Promise<AdminTournamentDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const response = await apiFetch(
    `${baseUrl}${ADMIN_TOURNAMENTS_PATH}/${tournamentId}`,
    {
      method: 'PUT',
      body: formData,
    }
  );
  return parseOrThrow<AdminTournamentDetail>(response);
}

export async function cancelAdminTournament(
  tournamentId: number,
  force: boolean
): Promise<void> {
  const url = buildUrl(`${ADMIN_TOURNAMENTS_PATH}/${tournamentId}`, {
    force: String(force),
  });

  const response = await apiFetch(url, { method: 'PATCH' });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(
      errorBody?.message ?? errorBody?.error ?? `HTTP ${response.status}`
    );
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
}

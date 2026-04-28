'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listAdminTournaments } from '@/services/admin/adminTournamentService';
import type { TournamentGame } from '@/types/admin/tournament';

export interface AdminTournamentsQueryParams {
  game?: TournamentGame;
  page: number;
  size: number;
  sort: string;
}

export const adminTournamentsQueryKey = (params: AdminTournamentsQueryParams) =>
  ['admin', 'tournaments', params] as const;

export function useAdminTournaments(params: AdminTournamentsQueryParams) {
  return useQuery({
    queryKey: adminTournamentsQueryKey(params),
    queryFn: () => listAdminTournaments(params),
    placeholderData: keepPreviousData,
  });
}

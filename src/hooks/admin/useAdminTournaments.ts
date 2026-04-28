'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getAdminTournamentById,
  listAdminTournaments,
} from '@/services/admin/adminTournamentService';
import type { GameType } from '@/types/admin/tournament';

export interface AdminTournamentsQueryParams {
  game?: GameType;
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

export function useAdminTournament(tournamentId: number | null) {
  return useQuery({
    queryKey: ['admin', 'tournament', tournamentId],
    queryFn: () => getAdminTournamentById(tournamentId as number),
    enabled: tournamentId != null,
  });
}

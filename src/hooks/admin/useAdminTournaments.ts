'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getAdminTournamentById,
  listAdminTournaments,
} from '@/services/admin/adminTournamentService';
import type { GameType } from '@/types/admin/tournament';
import { adminKeys } from './queryKeys';

export interface AdminTournamentsQueryParams {
  game?: GameType;
  page: number;
  size: number;
  sort: string;
}

export function useAdminTournaments(params: AdminTournamentsQueryParams) {
  return useQuery({
    queryKey: adminKeys.tournamentsList(params),
    queryFn: () => listAdminTournaments(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminTournament(tournamentId: number | null) {
  return useQuery({
    queryKey: adminKeys.tournamentDetail(tournamentId),
    queryFn: () => getAdminTournamentById(tournamentId as number),
    enabled: tournamentId != null,
  });
}

'use client';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  banAdminTeam,
  listAdminTeamPayments,
  listAdminTournamentTeams,
} from '@/services/admin/adminTournamentTeamService';
import type { TeamStatus } from '@/types/admin/team';

export interface AdminTournamentTeamsParams {
  tournamentId: number;
  statusList: TeamStatus[];
  page: number;
  size: number;
}

export function useAdminTournamentTeams(params: AdminTournamentTeamsParams) {
  return useQuery({
    queryKey: ['admin', 'tournament-teams', params],
    queryFn: () => listAdminTournamentTeams(params),
    placeholderData: keepPreviousData,
    enabled: Number.isFinite(params.tournamentId),
  });
}

export interface AdminTeamPaymentsParams {
  tournamentId: number;
  teamId: number;
  page: number;
  size: number;
}

export function useAdminTeamPayments(
  params: AdminTeamPaymentsParams,
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'team-payments', params],
    queryFn: () => listAdminTeamPayments(params),
    placeholderData: keepPreviousData,
    enabled:
      enabled &&
      Number.isFinite(params.tournamentId) &&
      Number.isFinite(params.teamId),
  });
}

export function useBanTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tournamentId,
      teamId,
    }: {
      tournamentId: number;
      teamId: number;
    }) => banAdminTeam(tournamentId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournament-teams'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournaments'] });
    },
  });
}

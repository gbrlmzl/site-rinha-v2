'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cancelAdminTournament,
  createAdminTournament,
  updateAdminTournament,
} from '@/services/admin/adminTournamentService';
import { adminKeys } from './queryKeys';

export function useCreateTournament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminTournament,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminKeys.tournaments }),
  });
}

export function useUpdateTournament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateAdminTournament(id, formData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tournaments });
      queryClient.invalidateQueries({
        queryKey: adminKeys.tournamentDetail(variables.id),
      });
    },
  });
}

export function useCancelTournament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, force }: { id: number; force: boolean }) =>
      cancelAdminTournament(id, force),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminKeys.tournaments }),
  });
}

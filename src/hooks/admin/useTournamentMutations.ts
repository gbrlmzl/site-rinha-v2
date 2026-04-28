'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cancelAdminTournament,
  createAdminTournament,
  updateAdminTournament,
} from '@/services/admin/adminTournamentService';

const ADMIN_TOURNAMENTS_KEY = ['admin', 'tournaments'] as const;

export function useCreateTournament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminTournament,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ADMIN_TOURNAMENTS_KEY }),
  });
}

export function useUpdateTournament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateAdminTournament(id, formData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TOURNAMENTS_KEY });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'tournament', variables.id],
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
      queryClient.invalidateQueries({ queryKey: ADMIN_TOURNAMENTS_KEY }),
  });
}

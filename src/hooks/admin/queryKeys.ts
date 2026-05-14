/**
 * Fábrica de query keys do React Query para o módulo admin.
 * Centraliza as chaves usadas em useQuery / invalidateQueries — renomear
 * uma chave aqui propaga para todos os consumidores sem string solta.
 */
export const adminKeys = {
  all: ['admin'] as const,

  tournaments: ['admin', 'tournaments'] as const,
  tournamentsList: (params: unknown) => ['admin', 'tournaments', params] as const,
  tournamentDetail: (id: number | null) => ['admin', 'tournament', id] as const,

  tournamentTeams: ['admin', 'tournament-teams'] as const,
  tournamentTeamsList: (params: unknown) => ['admin', 'tournament-teams', params] as const,

  tournamentPayments: ['admin', 'tournament-payments'] as const,
  tournamentPaymentsList: (params: unknown) => ['admin', 'tournament-payments', params] as const,

  teamPayments: ['admin', 'team-payments'] as const,
  teamPaymentsList: (params: unknown) => ['admin', 'team-payments', params] as const,

  paymentEvents: (id: number | null) => ['admin', 'payment-events', id] as const,
} as const;

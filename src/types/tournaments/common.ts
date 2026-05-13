export type GameType =
  | 'LEAGUE_OF_LEGENDS'
  | 'COUNTER_STRIKE'
  | 'VALORANT';

export type TournamentStatus =
  | 'OPEN'
  | 'FULL'
  | 'ONGOING'
  | 'FINISHED'
  | 'CANCELED';

export type TeamStatus =
  | 'PENDING_PAYMENT'
  | 'EXPIRED_PAYMENT'
  | 'EXPIRED_PAYMENT_PROBLEM'
  | 'READY'
  | 'FINISHED'
  | 'CANCELED'
  | 'BANNED';

export const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  OPEN: 'Inscrições Abertas',
  FULL: 'Vagas Esgotadas',
  ONGOING: 'Em Andamento',
  FINISHED: 'Finalizado',
  CANCELED: 'Cancelado',
};

export const TEAM_STATUS_LABELS: Record<TeamStatus, string> = {
  PENDING_PAYMENT: 'Aguardando Pagamento',
  EXPIRED_PAYMENT: 'Pagamento Expirado',
  EXPIRED_PAYMENT_PROBLEM: 'Problema No Pagamento',
  READY: 'Confirmado',
  FINISHED: 'Finalizado',
  CANCELED: 'Cancelado',
  BANNED: 'Banido',
};

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

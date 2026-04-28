export type TournamentGame = 'LEAGUE_OF_LEGENDS' | 'VALORANT' | 'COUNTER_STRIKE';

export type TournamentStatus =
  | 'OPEN'
  | 'FULL'
  | 'ONGOING'
  | 'FINISHED'
  | 'CANCELED';

/** Espelha TournamentAdminSummaryData do back. */
export interface AdminTournamentSummary {
  id: number;
  slug: string;
  name: string;
  game: TournamentGame;
  status: TournamentStatus;
  confirmedTeamsCount: number;
  maxTeams: number;
  prizePool: number;
  startsAt: string;
  endsAt: string;
  imageUrl: string | null;
}

/** Espelha TournamentAdminDetailData do back. */
export interface AdminTournamentDetail {
  id: number;
  slug: string;
  name: string;
  game: TournamentGame;
  status: TournamentStatus;
  maxTeams: number;
  prizePool: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  description: string;
  imageUrl: string | null;
  rulesUrl: string;
}

/** Página paginada genérica do Spring Data. */
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

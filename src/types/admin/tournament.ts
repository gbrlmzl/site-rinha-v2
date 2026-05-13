import type { GameType, TournamentStatus, Page } from '@/types/tournaments/common';

export type { GameType, TournamentStatus, Page };

/** Espelha TournamentAdminSummaryData do back. */
export interface AdminTournamentSummary {
  id: number;
  slug: string;
  name: string;
  game: GameType;
  status: TournamentStatus;
  /** Equipes em READY — contador "X/16" exibido na lista. */
  confirmedTeamsCount: number;
  /** Equipes ativas (PENDING_PAYMENT + READY) — usado para decidir delete vs cancel. */
  activeTeamsCount: number;
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
  game: GameType;
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

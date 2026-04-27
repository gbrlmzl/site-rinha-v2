export interface SubscribeTournamentResume {
  status: string;
  name: string;
  teamName: string;
}

export interface SubscribeTournamentPendent extends SubscribeTournamentResume {
  expiresAt: string;
}

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

export interface MyTournamentsSummaryData {
  id: number;
  slug: string;
  tournamentName: string;
  teamName: string;
  game: GameType;
  status: TournamentStatus;
  teamStatus: TeamStatus;
  startsAt: string;
  endsAt?: string | null;
  expiresAtPayment: string | null;
}

export interface TournamentPublicSummaryData {
  id: number;
  slug : string;
  name: string;
  game: GameType;
  status: TournamentStatus;
  confirmedTeamsCount: number;
  maxTeams: number;
  startsAt: string;
  endsAt: string | null;
  prizePool: number;
  imageUrl: string;
  rulesUrl: string;
}

// ─── Player / Team detail types ──────────────────────────────────────────

export type PlayerRole =
  | 'TOP_LANER'
  | 'JUNGLER'
  | 'MID_LANER'
  | 'AD_CARRY'
  | 'SUPPORT'
  | 'FILL';

export const PLAYER_ROLE_LABELS: Record<PlayerRole, string> = {
  TOP_LANER: 'Top',
  JUNGLER: 'Jungle',
  MID_LANER: 'Mid',
  AD_CARRY: 'ADC',
  SUPPORT: 'Suporte',
  FILL: 'Fill',
};

export interface PlayerPublicData {
  nickname: string;
  role: PlayerRole;
}

export interface TeamPublicData {
  id: number;
  name: string;
  shieldUrl: string;
  captainNickname: string;
  players: PlayerPublicData[];
}

export interface UserTeamStatusData {
  teamStatus: TeamStatus;
  teamName: string;
  teamShieldUrl: string;
  captainNickname: string | null;
  players: PlayerPublicData[];
}

export interface TournamentDetailData {
  id: number;
  slug: string;
  name: string;
  description: string;
  rulesUrl: string;
  game: GameType;
  status: TournamentStatus;
  confirmedTeamsCount: number;
  maxTeams: number;
  prizePool: number;
  startsAt: string;
  endsAt: string | null;
  imageUrl: string;
  confirmedTeams: TeamPublicData[];
  userTeam: UserTeamStatusData | null;
}

// ─── Pagination ───────────────────────────────────────────────────────────

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

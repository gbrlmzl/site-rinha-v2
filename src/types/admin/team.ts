import type { TeamStatus } from '@/types/tournaments/common';
import type { PaymentStatus } from '@/types/admin/payment';
import type { PlayerRole } from '@/types/lol/tournaments/tournament';

export type { TeamStatus };

/**
 * Roles aceitas no app — back hoje só define o enum de LoL,
 * mas o front pode receber strings de outros jogos (CS2/Valorant).
 * Tratamos como `PlayerRole | string` pra não quebrar a UI.
 */
export type AdminPlayerRole = PlayerRole | string;

export interface AdminPlayer {
  nickname: string;
  role: AdminPlayerRole;
}

/** Espelha TeamAdminSummaryData do back (com players incluídos). */
export interface AdminTeamSummary {
  id: number;
  name: string;
  shieldUrl: string | null;
  captainUsername: string;
  status: TeamStatus;
  active: boolean;
  playersCount: number;
  players: AdminPlayer[];
  lastPaymentStatus: PaymentStatus | null;
  createdAt: string;
}

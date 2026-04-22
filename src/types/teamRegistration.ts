/**
 * Types para o sistema de cadastro/inscrição de equipes LoL
 * Centraliza as interfaces e tipos de dados
 */

import { register } from "module";

// ─── Player ───────────────────────────────────────────────────────────────

export type PlayerPosition =
  | 'TOP_LANER'
  | 'JUNGLER'
  | 'MID_LANER'
  | 'AD_CARRY'
  | 'SUPPORT'
  | 'FILL';

export interface Player {
  playerName: string;
  schoolId: string;
  nickname: string;
  discordUser: string;
  role: PlayerPosition;
  isExternalPlayer: boolean;
  disabledPlayer: boolean;
}

// ─── Team ─────────────────────────────────────────────────────────────────

export interface Team {
  teamName: string;
  teamShield: File | null; //File
}

export interface CanceledTeamData {
  teamId: number;
  captainId: number;
  captainUser: string;
  name: string;
  status: string;
}

export interface CancelTournamentRegistrationResponse {
  success: boolean;
  message: string;
  data?: CanceledTeamData;
}

// ─── Payment ──────────────────────────────────────────────────────────────

export interface PaymentForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
}

export interface GeneratedPaymentData {
  uuid: string;
  qrCode: string;
  qrCodeBase64: string;
  value: number;
  expiresAt: string;
}

// ─── Registration State ────────────────────────────────────────────────────

export type StepType = 'teamInfo' | 'playersInfo' | 'confirmation' | 'payment';

export interface TeamRegistrationState {
  team: Team;
  players: Player[];
  paymentForm: PaymentForm;
  currentStep: StepType;
  //shieldFile: File | null; // Arquivo em memória antes do upload
  shieldPreview: string | null; // Data URL para preview
}

// ─── Submission & API ──────────────────────────────────────────────────────

export interface TeamRegistrationPayload {
  dadosEquipe: Team & {
    jogadores: Player[]; // Apenas ativos (não desabilitados)
  };
  dadosPagamento: PaymentForm;
}

export interface ExceptionResponse {
  error : string;
}


type TeamStatus =
  | 'PENDING_PAYMENT'
  | 'EXPIRED_PAYMENT'
  | 'EXPIRED_PAYMENT_PROBLEM'
  | 'READY'
  | 'FINISHED'
  | 'CANCELED'
  | 'BANNED';


type TournamentStatus =
 | 'OPEN'
 | 'FULL'
 | 'ONGOING'
 | 'CANCELED'
 | 'FINISHED';


type RegistrationData = {
  registered: boolean;
  teamStatus?: TeamStatus;
  tournamentStatus?: TournamentStatus;
  maxTeamsReached?: boolean;
}
export type RegisterStatusResponse = {
      registrationData: RegistrationData;
      paymentData?: GeneratedPaymentData;
    };

// types/registration.ts — adicione os estados de UI
export type RegistrationUIState ={
  status: 
    | 'loading' 
    | 'can_register'
    | 'tournament_closed'
    | 'tournament_full'
    | 'pending_payment'
    | 'payment_approved'
    | 'payment_expired' 
    | 'canceled' 
    | 'error';
  message?: string; // Mensagem opcional para fornecer detalhes adicionais
}


// ─── UI/UX Types ──────────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export interface StepConfig {
  key: StepType;
  label: string;
  title: string;
  description?: string;
}

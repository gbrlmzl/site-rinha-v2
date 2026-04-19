/**
 * Types para o sistema de cadastro/inscrição de equipes LoL
 * Centraliza as interfaces e tipos de dados
 */

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

// ─── Payment ──────────────────────────────────────────────────────────────

export interface PaymentForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
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

export interface PaymentResponse {
  uuid: string;
  qrCode: string;
  qrCodeBase64: string;
  valor: number;
}

export interface PaymentStatusMessage {
  status: 'PAGAMENTO REALIZADO' | 'PAGAMENTO PENDENTE' | string;
  uuid: string;
  timestamp?: string;
}

type PaymentStatus =
  | 'approved'
  | 'pending'
  | 'authorized'
  | 'rejected'
  | 'in_process'
  | 'in_mediation'
  | 'canceled'
  | 'expired'
  | 'refunded';

export type RegisterStatus =
  | { registered: false;
      /*
      paymentStatus: null;
      uuid: null;
      value: null;
      qrCode: null;
      qrCodeBase64: null;
      expiresAt: null;
      */
   }
  | {
      registered: true;
      paymentStatus: PaymentStatus;
      uuid: string;
      value: number;
      qrCode: string;
      qrCodeBase64: string;
      expiresAt: string;
    };

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

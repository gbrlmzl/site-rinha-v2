/**
 * Types para o sistema de cadastro/inscrição de equipes LoL
 * Centraliza as interfaces e tipos de dados
 */

// ─── Player ───────────────────────────────────────────────────────────────

export type PlayerPosition = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT' | 'FILL';

export interface Player {
  nomeJogador: string;
  matricula: string;
  nickname: string;
  discordUser: string;
  posicao: PlayerPosition;
  isExternalPlayer: boolean;
  disabledPlayer: boolean;
}

// ─── Team ─────────────────────────────────────────────────────────────────

export interface Team {
  nomeEquipe: string;
  escudo: string | null; // URL da imagem no Imgur (após upload)
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
  shieldFile: File | null; // Arquivo em memória antes do upload
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

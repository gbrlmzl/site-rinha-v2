/**
 * Constantes e utilitários para o cadastro de equipes
 */

import TopIcon from '@/assets/icons/Position-Top.png';
import JungleIcon from '@/assets/icons/Position-Jungle.png';
import MidIcon from '@/assets/icons/Position-Mid.png';
import ADCIcon from '@/assets/icons/Position-Bot.png';
import SupportIcon from '@/assets/icons/Position-Support.png';
import DefaultIcon from '@/assets/icons/Position-Fill.png';
import { StepConfig, PlayerPosition } from '@/types/teamRegistration';

// ─── Steps ────────────────────────────────────────────────────────────────

export const STEPS: StepConfig[] = [
  {
    key: 'teamInfo',
    label: 'Equipe',
    title: 'Informações da Equipe',
    description: 'Preencha os dados da sua equipe e faça upload do escudo',
  },
  {
    key: 'playersInfo',
    label: 'Jogadores',
    title: 'Informações dos Jogadores',
    description: '5 titulares + 1 reserva (opcional)',
  },
  {
    key: 'confirmation',
    label: 'Confirmação',
    title: 'Revise os Dados',
    description: 'Verifique tudo antes de prosseguir ao pagamento',
  },
  {
    key: 'payment',
    label: 'Pagamento',
    title: 'Efetuar Pagamento',
    description: 'Finalize sua inscrição via PIX',
  },
];

export const STEP_LIST = [
  'teamInfo',
  'playersInfo',
  'confirmation',
  'payment',
] as const;

// ─── Players ──────────────────────────────────────────────────────────────

export const PLAYER_LABELS = [
  'Jogador 1 (Capitão)',
  'Jogador 2',
  'Jogador 3',
  'Jogador 4',
  'Jogador 5',
  'Jogador 6 (Reserva - Opcional)',
];

export const PLAYER_POSITIONS = [
  { key: 'TOP_LANER' as const, label: 'Top', icon: TopIcon },
  { key: 'JUNGLER' as const, label: 'Jungle', icon: JungleIcon },
  { key: 'MID_LANER' as const, label: 'Mid', icon: MidIcon },
  { key: 'AD_CARRY' as const, label: 'ADC', icon: ADCIcon },
  { key: 'SUPPORT' as const, label: 'Suporte', icon: SupportIcon },
  { key: 'FILL' as const, label: 'Preencher', icon: DefaultIcon },
];

export const DEFAULT_POSITION_ICON = DefaultIcon;

export function getPositionIcon(position: PlayerPosition) {
  //if (position === 'FILL') return DEFAULT_POSITION_ICON;
  const pos = PLAYER_POSITIONS.find((p) => p.key === position);
  return pos?.icon || DEFAULT_POSITION_ICON;
}

// ─── Payment ──────────────────────────────────────────────────────────────

export const PAYMENT_FEE_PER_PLAYER = 10; // R$10 por jogador

export function calculatePaymentValue(activePlayers: number): number {
  return PAYMENT_FEE_PER_PLAYER * activePlayers;
}

// ─── Validation Messages ──────────────────────────────────────────────────

export const VALIDATION_MESSAGES = {
  TEAM_NAME_REQUIRED: 'Nome da equipe é obrigatório',
  TEAM_NAME_LENGTH: 'Nome da equipe deve ter entre 3 e 30 caracteres',
  SHIELD_REQUIRED: 'Escudo da equipe é obrigatório',
  SHIELD_UPLOADING: 'Carregando escudo...',
  SHIELD_UPLOAD_ERROR: 'Erro ao fazer upload do escudo',

  PLAYER_NAME_REQUIRED: 'Nome do jogador é obrigatório',
  PLAYER_NICKNAME_REQUIRED: 'Nickname é obrigatório',
  PLAYER_DISCORD_REQUIRED: 'Discord é obrigatório',
  PLAYER_SCHOOL_ID_REQUIRED: 'Matrícula é obrigatória',
  PLAYER_SCHOOL_ID_INVALID: 'Matrícula inválida (6-11 dígitos)',
  PLAYER_POSITION_REQUIRED: 'Selecione uma posição',
  PLAYERS_SCHOOL_ID_UNIQUE: 'Matrículas dos jogadores devem ser únicas',

  CPF_REQUIRED: 'CPF é obrigatório',
  CPF_INVALID: 'CPF inválido (deve ter 11 dígitos)',
  PAYMENT_NAME_REQUIRED: 'Nome é obrigatório',
  PAYMENT_SURNAME_REQUIRED: 'Sobrenome é obrigatório',
  PAYMENT_EMAIL_REQUIRED: 'Email é obrigatório',
  PAYMENT_EMAIL_INVALID: 'Email deve ser válido',

  TERMS_REQUIRED: 'Você deve concordar com os termos',
};

// ─── Theme Colors ────────────────────────────────────────────────────────

export const THEME_COLORS = {
  bg: '#080d2e',
  surface: '#0E1241',
  surfaceHigh: '#151a54',
  border: 'rgba(255,255,255,0.08)',
  accent: '#11B5E4',
  accentHover: '#0b80a0',
  danger: '#ff6b6b',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.45)',
};

// ─── Initial States ──────────────────────────────────────────────────────

export const INITIAL_TEAM = {
  teamName: '',
  teamShield: null,
};

export const INITIAL_PLAYER = {
  playerName: '',
  schoolId: '',
  nickname: '',
  discordUser: '',
  role: 'FILL' as const,
  isExternalPlayer: false,
  disabledPlayer: false,
};

export const INITIAL_PLAYERS = Array(6)
  .fill(null)
  .map((_, i) => ({
    ...INITIAL_PLAYER,
    disabledPlayer: false,
  }));

export const INITIAL_PAYMENT_FORM = {
  nome: '',
  sobrenome: '',
  email: '',
  cpf: '',
};

// ─── Regex Patterns ──────────────────────────────────────────────────────

export const REGEX = {
  CPF: /^\d{11}$/,
  SCHOOL_ID: /^\d{6,11}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DISCORD_USER: /^.{2,50}$/,
};

// ─── API Endpoints ───────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  WEBSOCKET_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
};


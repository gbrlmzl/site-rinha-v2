/**
 * Schemas de validação com Zod
 * Reutilizáveis em cliente e servidor
 */

import { z } from 'zod';
import { PlayerPosition } from '@/types/teamRegistration';

// ─── Base Schemas ─────────────────────────────────────────────────────────

const PositionEnum = z.enum(['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT', 'FILL'] as const);

const BasePlayerSchema = z.object({
  nomeJogador: z
    .string()
    .min(3, 'Nome do jogador deve ter pelo menos 3 caracteres')
    .max(50, 'Nome do jogador deve ter no máximo 50 caracteres'),
  nickname: z
    .string()
    .min(3, 'Nickname deve ter pelo menos 3 caracteres')
    .max(30, 'Nickname deve ter no máximo 30 caracteres'),
  discordUser: z
    .string()
    .min(2, 'Discord user deve ter pelo menos 2 caracteres')
    .max(50, 'Discord user deve ter no máximo 50 caracteres'),
  posicao: PositionEnum.refine((val) => val !== 'FILL', {
    message: 'Posição inválida',
  }),
  isExternalPlayer: z.boolean(),
  disabledPlayer: z.boolean(),
});

// ─── Jogador Titulares (com matrícula obrigatória) ────────────────────────

export const TitularPlayerSchema = BasePlayerSchema.extend({
  matricula: z
    .string()
    .regex(/^\d{6,11}$/, 'Matrícula deve ter 6 a 11 dígitos')
    .min(6, 'Matrícula obrigatória para jogadores titulares'),
}).refine(
  (data) => !data.disabledPlayer,
  { message: 'Jogadores titulares não podem ser desabilitados' }
);

// ─── Jogador Reserva (posicao obrigatória, matrícula opcional se externo) ────

export const ReservaPlayerSchema = BasePlayerSchema.extend({
  matricula: z
    .string()
    .regex(/^\d{6,11}$/, 'Matrícula deve ter 6 a 11 dígitos')
    .optional()
    .transform((val) => val || ''),
}).refine(
  (data) => {
    // Se NÃO é jogador externo e NÃO está desabilitado, precisa de matrícula
    if (!data.isExternalPlayer && !data.disabledPlayer && !data.matricula) {
      return false;
    }
    return true;
  },
  { message: 'Matrícula obrigatória se jogador não for externo' }
);

// ─── Jogador Desabilitado (reserva) ───────────────────────────────────────

export const DisabledPlayerSchema = z.object({
  nomeJogador: z.string().optional().transform(() => ''),
  matricula: z.string().optional().transform(() => ''),
  nickname: z.string().optional().transform(() => ''),
  discordUser: z.string().optional().transform(() => ''),
  posicao: z.string().optional().transform(() => 'FILL'),
  isExternalPlayer: z.boolean().optional().transform(() => false),
  disabledPlayer: z.literal(true),
});

// ─── Team ─────────────────────────────────────────────────────────────────

export const TeamSchema = z.object({
  nomeEquipe: z
    .string()
    .min(3, 'Nome da equipe deve ter pelo menos 3 caracteres')
    .max(30, 'Nome da equipe deve ter no máximo 30 caracteres'),
  escudo: z.string().nullable().optional(),
});

// ─── Payment ──────────────────────────────────────────────────────────────

export const PaymentFormSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  sobrenome: z
    .string()
    .min(1, 'Sobrenome é obrigatório')
    .max(50, 'Sobrenome deve ter no máximo 50 caracteres'),
  email: z.
  email('Email deve ser válido').max(100, 'Email deve ter no máximo 100 caracteres'),
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
});

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Valida um jogador específico baseado em sua posição no array
 * @param player - Dados do jogador
 * @param playerIndex - Índice do jogador (0-4 = titular, 5 = reserva)
 * @returns { success: boolean, errors: { [key]: string } }
 */
export function validatePlayer(player: any, playerIndex: number) {
  let schema;

  if (playerIndex < 5) {
    // Primeiros 5 são titulares
    schema = TitularPlayerSchema;
  } else {
    // 6º é reserva (pode ser desabilitado ou externo)
    schema = ReservaPlayerSchema.or(DisabledPlayerSchema);
  }

  const result = schema.safeParse(player);

  return {
    success: result.success,
    errors: result.success ? {} : result.error.issues
  };
}

/**
 * Valida a equipe
 */
export function validateTeam(team: any) {
  const result = TeamSchema.safeParse(team);
  return {
    success: result.success,
    errors: result.success ? {} : result.error.issues
  };
}

/**
 * Valida o formulário de pagamento
 */
export function validatePaymentForm(form: any) {
  const result = PaymentFormSchema.safeParse(form);
  return {
    success: result.success,
    errors: result.success ? {} : result.error.issues
  };
}

/**
 * Valida equipe + jogadores (matrículas únicas)
 */
export function validatePlayers(players: any[]) {

  // Validar cada jogador
  const playersValidation = players.map((player, idx) => validatePlayer(player, idx));
  const hasInvalidPlayers = playersValidation.some((v) => !v.success);

  if (hasInvalidPlayers) {
    const firstInvalidIdx = playersValidation.findIndex((v) => !v.success);
    return {
      success: false,
      step: 'players',
      playerIndex: firstInvalidIdx,
      errors: playersValidation[firstInvalidIdx].errors,
    };
  }

  // Verificar matrículas únicas entre titulares
  const matriculas = players
    .slice(0, 5) // Apenas titulares
    .filter((p) => !p.disabledPlayer)
    .map((p) => p.matricula)
    .filter((m) => m !== '');

  const uniqueMatriculas = new Set(matriculas);
  if (matriculas.length !== uniqueMatriculas.size) {
    return {
      success: false,
      step: 'players',
      message: 'Matrículas dos jogadores titulares devem ser únicas',
    };
  }

  return { success: true };
}

/**
 * Schemas de validação com Zod
 * Reutilizáveis em cliente e servidor
 */

import { z } from 'zod';

// ─── Base Schemas ─────────────────────────────────────────────────────────

const PositionEnum = z.enum([
  'TOP_LANER',
  'JUNGLER',
  'MID_LANER',
  'AD_CARRY',
  'SUPPORT',
  'FILL',
] as const);

const BasePlayerSchema = z.object({
  playerName: z
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
  role: PositionEnum.refine((val) => val !== null, {
    message: 'Posição inválida',
  }),
  isExternalPlayer: z.boolean(),
  disabledPlayer: z.boolean(),
});

// ─── Jogador Titulares (com matrícula obrigatória) ────────────────────────

export const TitularPlayerSchema = BasePlayerSchema.extend({
  schoolId: z.string().optional(),
}).superRefine((data, ctx) => {
  // Jogadores titulares não podem ser desabilitados
  if (data.disabledPlayer) {
    ctx.addIssue({
      code: 'custom',
      message: 'Jogadores titulares não podem ser desabilitados',
      path: ['disabledPlayer'],
    });
  }

  // Matrícula só é obrigatória se não for jogador externo
  if (!data.isExternalPlayer) {
    if (!data.schoolId || data.schoolId.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        message: 'O capitão deve possuir matrícula na UFPB',
        path: ['schoolId'], // ← aponta o erro para o campo correto
      });
    } else if (!/^\d{6,11}$/.test(data.schoolId)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Matrícula deve ter entre 6 e 11 dígitos',
        path: ['schoolId'],
      });
    }
  }
});

// ─── Jogador Reserva (posicao obrigatória, matrícula opcional se externo) ────

export const ReservaPlayerSchema = BasePlayerSchema.extend({
  schoolId: z
    .string()
    .regex(/^\d{6,11}$/, 'Matrícula deve ter 6 a 11 dígitos')
    .optional()
    .transform((val) => val || ''),
}).refine(
  (data) => {
    // Se NÃO é jogador externo e NÃO está desabilitado, precisa de matrícula
    if (!data.isExternalPlayer && !data.disabledPlayer && !data.schoolId) {
      return false;
    }
    return true;
  },
  { message: 'Matrícula obrigatória se jogador não for externo' }
);

// ─── Jogador Desabilitado (reserva) ───────────────────────────────────────

export const DisabledPlayerSchema = z.object({
  playerName: z
    .string()
    .optional()
    .transform(() => ''),
  schoolId: z
    .string()
    .optional()
    .transform(() => ''),
  nickname: z
    .string()
    .optional()
    .transform(() => ''),
  discordUser: z
    .string()
    .optional()
    .transform(() => ''),
  role: z
    .string()
    .optional()
    .transform(() => 'FILL'),
  isExternalPlayer: z
    .boolean()
    .optional()
    .transform(() => false),
  disabledPlayer: z.literal(true),
});

// ─── Team ─────────────────────────────────────────────────────────────────

//teamShield é opcional(pode ser null), e caso exista, deve ser um arquivo do tipo imagem (jpeg ou png)
export const TeamSchema = z.object({
  teamName: z
    .string()
    .min(3, 'Nome da equipe deve ter pelo menos 3 caracteres')
    .max(30, 'Nome da equipe deve ter no máximo 30 caracteres'),
  teamShield: z
    .file()
    .nullable()
    .optional()
    .refine((file) => {
      if (file == null) return true;
      const validTypes = ['image/jpeg', 'image/png'];
      return file instanceof File && validTypes.includes(file.type);
    }, 'Escudo deve ser um arquivo JPEG ou PNG'),
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
  email: z
    .email('Email deve ser válido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
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
    errors: result.success ? {} : result.error.issues,
  };
}

/**
 * Valida a equipe
 */
export function validateTeam(team: any) {
  const result = TeamSchema.safeParse(team);
  return {
    success: result.success,
    errors: result.success ? {} : result.error.issues,
  };
}

/**
 * Valida o formulário de pagamento
 */
export function validatePaymentForm(form: any) {
  const result = PaymentFormSchema.safeParse(form);
  return {
    success: result.success,
    errors: result.success ? {} : result.error.issues,
  };
}

/**
 * Valida equipe + jogadores (matrículas, nickname, unicos)
 */
export function validateAllPLayers(players: any[]) {
  // Validar cada jogador
  const playersValidation = players.map((player, idx) =>
    validatePlayer(player, idx)
  );
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
  const schoolIds = players
    .slice(0, 5) // Apenas titulares
    .filter((p) => !p.disabledPlayer)
    .map((p) => p.schoolId)
    .filter((m) => m !== '');

  const uniqueschoolIds = new Set(schoolIds);
  if (schoolIds.length !== uniqueschoolIds.size) {
    return {
      success: false,
      step: 'players',
      message: 'Matrículas dos jogadores titulares devem ser únicas',
    };
  }

  // Verificar nicknames únicos (case-insensitive) entre jogadores ativos
  const nicknames = players
    .filter((p) => !p.disabledPlayer)
    .map((p) => (p.nickname || '').trim().toLowerCase())
    .filter((n) => n !== '');

  const uniqueNicknames = new Set(nicknames);
  if (nicknames.length !== uniqueNicknames.size) {
    return {
      success: false,
      step: 'players',
      message: 'Nicknames dos jogadores devem ser únicos',
    };
  }

  return { success: true };
}

import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

export const TOURNAMENT_GAMES = [
  'LEAGUE_OF_LEGENDS',
  'VALORANT',
  'COUNTER_STRIKE',
] as const;

export const TOURNAMENT_EDITABLE_STATUSES = [
  'OPEN',
  'FULL',
  'ONGOING',
  'FINISHED',
] as const;

const dayjsSchema = z.custom<Dayjs>(
  (value) => dayjs.isDayjs(value) && (value as Dayjs).isValid(),
  { message: 'Data inválida' }
);

export const tournamentFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(10, 'Mínimo de 10 caracteres')
      .max(50, 'Máximo de 50 caracteres'),
    game: z.enum(TOURNAMENT_GAMES),
    maxTeams: z.number().int().min(2, 'Mínimo de 2 equipes'),
    prizePool: z.number().min(0, 'Não pode ser negativo'),
    startsAt: dayjsSchema,
    endsAt: dayjsSchema,
    description: z.string().trim().min(1, 'Descrição obrigatória'),
    rulesUrl: z.string().url('URL inválida'),
    image: z.instanceof(File).nullable().optional(),
    status: z.enum(TOURNAMENT_EDITABLE_STATUSES).optional(),
  })
  .superRefine((data, ctx) => {
    const oneHourFromNow = dayjs().add(1, 'hour');
    if (data.startsAt.isBefore(oneHourFromNow)) {
      ctx.addIssue({
        code: 'custom',
        path: ['startsAt'],
        message: 'Início deve ser pelo menos 1h no futuro',
      });
    }
    const minEnd = data.startsAt.add(1, 'hour');
    if (data.endsAt.isBefore(minEnd)) {
      ctx.addIssue({
        code: 'custom',
        path: ['endsAt'],
        message: 'Término deve ser pelo menos 1h após o início',
      });
    }
  });

export type TournamentFormValues = z.infer<typeof tournamentFormSchema>;

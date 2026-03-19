import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z.string().trim().min(3, 'Nome de usuário deve ter ao menos 3 caracteres'),
    email: z.email('Email inválido'),
    password: z
      .string()
      .min(8, 'A senha deve ter ao menos 8 caracteres')
      .regex(/[\d\W]/, 'A senha deve conter um número ou símbolo'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas devem coincidir',
  });


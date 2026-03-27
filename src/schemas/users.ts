import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z.string().trim().min(3, 'Nome de usuário deve ter ao menos 3 caracteres')
    .regex(/^\S+$/, 'Nome de usuário não pode conter espaços')
    .regex(/^[a-z0-9_.]+$/, `Nome de usuário deve conter apenas letras, números, "_" e "."`)
    .max(20, 'Nome de usuário deve ter no máximo 20 caracteres')
    .refine((username) => !/^\d/.test(username), 'Nome de usuário não pode começar com número'),
    email: z.email('Email inválido'),
    password: z
      .string()
      .min(8, 'A senha deve ter ao menos 8 caracteres')
      .regex(/[\d\W]/, 'A senha deve conter um número ou símbolo'),
    confirmPassword: z.string(),
    keepLoggedIn: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas devem coincidir',
  });




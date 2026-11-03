import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Ingresa un correo válido.'),
  user_password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.').max(72),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

import { z } from 'zod';

const optionalPositiveNumber = (maximum: number, unit: string) => z.string().trim().refine(
  (value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) > 0 && Number(value) <= maximum),
  `Ingresa un valor válido en ${unit}.`,
);

export const patientFormSchema = z.object({
  full_name: z.string().trim().min(2, 'Escribe el nombre completo.').max(100),
  age_months: z.string().trim().refine(
    (value) => /^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 72,
    'La edad debe estar entre 0 y 72 meses.',
  ),
  sex: z.enum(['M', 'F']),
  weight: optionalPositiveNumber(150, 'kg'),
  height: optionalPositiveNumber(250, 'cm'),
  guardian_name: z.string().trim().max(100, 'Máximo 100 caracteres.'),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

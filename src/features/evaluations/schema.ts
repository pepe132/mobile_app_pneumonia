import { z } from 'zod';

const integerBetween = (minimum: number, maximum: number, message: string) => z.string().trim().refine(
  (value) => /^\d+$/.test(value) && Number(value) >= minimum && Number(value) <= maximum,
  message,
);

const decimalBetween = (minimum: number, maximum: number, message: string) => z.string().trim().refine(
  (value) => value !== '' && !Number.isNaN(Number(value)) && Number(value) >= minimum && Number(value) <= maximum,
  message,
);

export const classificationFormSchema = z.object({
  edad_meses: integerBetween(0, 72, 'La edad debe estar entre 0 y 72 meses.'),
  peso_kg: decimalBetween(0.01, 150, 'Ingresa un peso válido.'),
  fr: integerBetween(0, 120, 'La frecuencia respiratoria debe estar entre 0 y 120.'),
  fc: integerBetween(0, 250, 'La frecuencia cardiaca debe estar entre 0 y 250.'),
  temperatura_c: decimalBetween(30, 45, 'La temperatura debe estar entre 30 y 45 °C.'),
  spo2: integerBetween(0, 100, 'La saturación debe estar entre 0 y 100%.'),
  glasgow: integerBetween(3, 15, 'Glasgow debe estar entre 3 y 15.'),
  dias_sintomas: integerBetween(0, 60, 'Ingresa un valor entre 0 y 60 días.'),
  dias_fiebre: integerBetween(0, 60, 'Ingresa un valor entre 0 y 60 días.'),
  dias_tos: integerBetween(0, 60, 'Ingresa un valor entre 0 y 60 días.'),
  dias_dificultad_respiratoria: integerBetween(0, 60, 'Ingresa un valor entre 0 y 60 días.'),
  tiraje: z.boolean(), retraccion_xifoidea: z.boolean(), disociacion_toracoabdominal: z.boolean(),
  aleteo_nasal: z.boolean(), quejido_espiratorio: z.boolean(), cianosis: z.boolean(), apnea: z.boolean(),
  rechazo_comer: z.boolean(), vomita_todo: z.boolean(), convulsiones: z.boolean(), desnutricion: z.boolean(),
  antecedentes_cronicos: z.boolean(), sibilancias: z.boolean(), crepitantes: z.boolean(),
  disminucion_murmullo_vesicular: z.boolean(), dolor_toracico: z.boolean(),
});

export type ClassificationFormValues = z.infer<typeof classificationFormSchema>;

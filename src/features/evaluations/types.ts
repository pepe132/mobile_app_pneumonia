export type Severity = 'Bajo' | 'Medio' | 'Alto';

export type EvaluationPayload = {
  patient_id: string;
  edad_meses: number;
  peso_kg: number;
  fr: number;
  fc: number;
  temperatura_c: number;
  spo2: number;
  tiraje: boolean;
  retraccion_xifoidea: boolean;
  disociacion_toracoabdominal: boolean;
  aleteo_nasal: boolean;
  quejido_espiratorio: boolean;
  cianosis: boolean;
  apnea: boolean;
  rechazo_comer: boolean;
  vomita_todo: boolean;
  convulsiones: boolean;
  glasgow: number;
  desnutricion: boolean;
  antecedentes_cronicos: boolean;
  sibilancias: boolean;
  dias_sintomas: number;
  dias_fiebre: number;
  dias_tos: number;
  dias_dificultad_respiratoria: number;
  crepitantes: boolean;
  disminucion_murmullo_vesicular: boolean;
  dolor_toracico: boolean;
};

export type Evaluation = EvaluationPayload & {
  evaluation_id: string;
  created_by: string;
  severity_tabular: Severity | null;
  prob_low: number | null;
  prob_medium: number | null;
  prob_high: number | null;
  final_severity: Severity | null;
  radiographic_support: string | null;
  concordance: string | null;
  fusion_basis: string | null;
  fusion_explanation: string | null;
  recommendation_code: string | null;
  fusion_version: string | null;
  created_at: string;
};

export type EvaluationPage = {
  items: Evaluation[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

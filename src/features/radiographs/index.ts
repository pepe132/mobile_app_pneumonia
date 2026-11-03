import { apiRequest } from '../../api/client';

export type ImageClass = 'covid_19' | 'normal' | 'pneumonia_bacterial' | 'pneumonia_viral';
export type RadiographicSupport = 'not_available' | 'supports_pneumonia' | 'does_not_support_pneumonia' | 'indeterminate' | 'review_required';
export type Concordance = 'not_applicable' | 'concordant' | 'discordant' | 'indeterminate';

export type Radiograph = {
  radiograph_id: string;
  evaluation_id: string;
  uploaded_by: string;
  original_filename: string;
  content_type: string;
  file_size: number;
  image_class: ImageClass;
  confidence: number;
  probabilities: Record<ImageClass, number>;
  pneumonia_probability: number;
  model_version: string;
  created_at: string;
};

export type IntegratedResult = {
  final_severity: string;
  radiographic_support: RadiographicSupport;
  concordance: Concordance;
  basis: 'tabular_only' | 'clinical_and_radiographic';
  explanation: string;
  recommendation_code: string;
  fusion_version: string;
  fusion_method: string;
};

export type AuxiliaryDecision = {
  clasificacion_auxiliar: string;
  prediccion_severidad: string;
  probabilidades_severidad: Record<string, number>;
  hallazgos_clinicos_relevantes: string[];
  resultado_radiografico_auxiliar: string;
  prediccion_radiografica: string;
  probabilidades_radiograficas: Record<string, number>;
  recomendacion: string;
  nota_seguridad: string;
  nivel_atencion: string;
  reglas_activadas: string[];
  recommendation_version: string;
  fusion_method: string;
  fusion_version: string;
};

export type RadiographAnalysis = {
  radiograph: Radiograph;
  integrated_result: IntegratedResult;
  auxiliary_decision: AuxiliaryDecision;
};

export const radiographsApi = {
  get: (evaluationId: string) => apiRequest<Radiograph>(`/evaluations/${encodeURIComponent(evaluationId)}/radiograph`),
  upload: (evaluationId: string, asset: { uri: string; name: string; type: string }) => {
    const body = new FormData();
    body.append('file', asset as unknown as Blob);
    return apiRequest<RadiographAnalysis>(`/evaluations/${encodeURIComponent(evaluationId)}/radiograph`, {
      method: 'POST',
      body,
    });
  },
};

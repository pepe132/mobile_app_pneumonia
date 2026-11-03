import { apiRequest } from '../../api/client';
import type { Evaluation, EvaluationPage, EvaluationPayload } from './types';

export const evaluationsApi = {
  create: (payload: EvaluationPayload) => apiRequest<Evaluation>('/evaluations', { method: 'POST', body: payload }),
  detail: (evaluationId: string) => apiRequest<Evaluation>(`/evaluations/${encodeURIComponent(evaluationId)}`),
  list(page = 1, pageSize = 10) {
    return apiRequest<EvaluationPage>(`/evaluations/page?page=${page}&page_size=${pageSize}`);
  },
};

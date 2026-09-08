import { apiRequest } from '../../api/client';
import type { Patient, PatientCreatePayload, PatientPage, PatientPageParams, PatientUpdatePayload } from './types';

export const patientsApi = {
  list({ page = 1, pageSize = 10, search }: PatientPageParams = {}) {
    const query = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    if (search?.trim()) query.set('search', search.trim());
    return apiRequest<PatientPage>(`/patients/page?${query.toString()}`);
  },
  detail(patientId: string) {
    return apiRequest<Patient>(`/patients/${encodeURIComponent(patientId)}`);
  },
  create(payload: PatientCreatePayload) {
    return apiRequest<Patient>('/patients/', { method: 'POST', body: payload });
  },
  update(patientId: string, payload: PatientUpdatePayload) {
    return apiRequest<Patient>(`/patients/${encodeURIComponent(patientId)}`, { method: 'PATCH', body: payload });
  },
  deactivate(patientId: string) {
    return apiRequest<void>(`/patients/${encodeURIComponent(patientId)}`, { method: 'DELETE' });
  },
};

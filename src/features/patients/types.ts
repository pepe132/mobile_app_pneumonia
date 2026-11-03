export type PatientSex = 'M' | 'F';

export type Patient = {
  patient_id: string;
  full_name: string;
  age_months: number;
  sex: PatientSex;
  weight: number | null;
  height: number | null;
  guardian_name: string | null;
  created_by: string;
  active: boolean;
  created_at: string;
  updated_at: string | null;
};

export type PatientPage = {
  items: Patient[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

export type PatientPageParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type PatientCreatePayload = {
  full_name: string;
  age_months: number;
  sex: PatientSex;
  weight: number | null;
  height: number | null;
  guardian_name: string | null;
};

export type PatientUpdatePayload = Partial<PatientCreatePayload> & {
  active?: boolean;
};

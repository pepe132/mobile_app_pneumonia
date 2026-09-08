import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/src/api/client';
import { ScreenState } from '@/src/components/ScreenState';
import { PatientForm } from '@/src/features/patients/PatientForm';
import { patientsApi } from '@/src/features/patients/api';
import type { PatientCreatePayload } from '@/src/features/patients/types';
import { colors } from '@/src/theme/colors';

export default function EditPatientScreen() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>();
  const query = useQuery({ queryKey: ['patient', patientId], queryFn: () => patientsApi.detail(patientId), enabled: Boolean(patientId) });
  const mutation = useMutation({ mutationFn: (payload: PatientCreatePayload) => patientsApi.update(patientId, payload) });

  async function updatePatient(payload: PatientCreatePayload) {
    setErrorMessage(undefined);
    try {
      await mutation.mutateAsync(payload);
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['patient', patientId] }), queryClient.invalidateQueries({ queryKey: ['patients'] })]);
      router.back();
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'No fue posible actualizar al paciente.');
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: 'Editar paciente', headerBackTitle: 'Detalle' }} />
      {query.isLoading ? <ScreenState kind="loading" /> : !query.data || query.isError ? <ScreenState kind="error" message="No fue posible consultar este paciente." /> : (
        <PatientForm
          defaultValues={{ full_name: query.data.full_name, age_months: String(query.data.age_months), sex: query.data.sex, weight: query.data.weight == null ? '' : String(query.data.weight), height: query.data.height == null ? '' : String(query.data.height), guardian_name: query.data.guardian_name ?? '' }}
          errorMessage={errorMessage}
          isSubmitting={mutation.isPending}
          onSubmit={updatePatient}
          submitLabel="Guardar cambios"
        />
      )}
    </SafeAreaView>
  );
}

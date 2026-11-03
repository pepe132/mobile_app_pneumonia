import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/src/api/client';
import { ScreenState } from '@/src/components/ScreenState';
import { ClassificationForm, type SelectedRadiograph } from '@/src/features/evaluations/ClassificationForm';
import { evaluationsApi } from '@/src/features/evaluations/api';
import type { EvaluationPayload } from '@/src/features/evaluations/types';
import { radiographsApi } from '@/src/features/radiographs';
import { patientsApi } from '@/src/features/patients/api';
import { colors } from '@/src/theme/colors';

export default function NewClassificationScreen() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const queryClient = useQueryClient();
  const patient = useQuery({ queryKey: ['patient', patientId], queryFn: () => patientsApi.detail(patientId), enabled: Boolean(patientId) });
  const mutation = useMutation({ mutationFn: evaluationsApi.create });
  async function classify(payload: EvaluationPayload, radiograph?: SelectedRadiograph) {
    setErrorMessage(undefined);
    try {
      const result = await mutation.mutateAsync(payload);
      if (radiograph) await radiographsApi.upload(result.evaluation_id, radiograph);
      await queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      router.replace({ pathname: '/(authenticated)/classifications/[evaluationId]', params: { evaluationId: result.evaluation_id } });
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'No fue posible generar la clasificación.');
    }
  }
  return <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background, flex: 1 }}>
    <Stack.Screen options={{ headerShown: true, title: 'Captura de variables', headerBackTitle: 'Paciente' }} />
    {patient.isLoading ? <ScreenState kind="loading" /> : patient.isError || !patient.data ? <ScreenState kind="error" message="No fue posible cargar al paciente." /> : <ClassificationForm ageMonths={patient.data.age_months} errorMessage={errorMessage} isSubmitting={mutation.isPending} onSubmit={classify} patientId={patient.data.patient_id} patientName={patient.data.full_name} weight={patient.data.weight} />}
  </SafeAreaView>;
}

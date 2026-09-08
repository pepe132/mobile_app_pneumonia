import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/src/api/client';
import { PatientForm } from '@/src/features/patients/PatientForm';
import { patientsApi } from '@/src/features/patients/api';
import type { PatientCreatePayload } from '@/src/features/patients/types';
import { colors } from '@/src/theme/colors';

export default function NewPatientScreen() {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>();
  const mutation = useMutation({ mutationFn: patientsApi.create });

  async function createPatient(payload: PatientCreatePayload) {
    setErrorMessage(undefined);
    try {
      const patient = await mutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: ['patients'] });
      router.replace({ pathname: '/(authenticated)/patients/[patientId]', params: { patientId: patient.patient_id } });
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'No fue posible guardar al paciente.');
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: 'Nuevo paciente', headerBackTitle: 'Pacientes' }} />
      <PatientForm errorMessage={errorMessage} isSubmitting={mutation.isPending} onSubmit={createPatient} submitLabel="Registrar paciente" />
    </SafeAreaView>
  );
}

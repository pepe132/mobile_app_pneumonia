import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenState } from '@/src/components/ScreenState';
import { patientsApi } from '@/src/features/patients/api';
import { useSession } from '@/src/features/auth/SessionContext';
import { colors } from '@/src/theme/colors';

function DetailRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return <View style={styles.row}><View style={styles.rowIcon}><Ionicons color={colors.primaryDark} name={icon} size={19} /></View><View><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View></View>;
}

export default function PatientDetailScreen() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['patient', patientId], queryFn: () => patientsApi.detail(patientId), enabled: Boolean(patientId) });
  const deactivate = useMutation({
    mutationFn: () => patientsApi.deactivate(patientId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['patients'] });
      router.replace('/(authenticated)/(tabs)/patients');
    },
  });
  const canWrite = user?.role_id === 1 || user?.role_id === 2;

  function confirmDeactivate() {
    Alert.alert('Desactivar paciente', 'El paciente dejará de aparecer en el listado activo. Su historial clínico se conservará.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Desactivar', style: 'destructive', onPress: () => deactivate.mutate() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: 'Detalle del paciente', headerBackTitle: 'Pacientes' }} />
      {query.isLoading ? <ScreenState kind="loading" /> : query.isError || !query.data ? <ScreenState kind="error" message="No fue posible consultar este paciente." /> : <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.identity}><View style={styles.avatar}><Ionicons color={colors.primaryDark} name="happy" size={34} /></View><Text style={styles.name}>{query.data.full_name}</Text><View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>{query.data.active ? 'Paciente activo' : 'Paciente inactivo'}</Text></View></View>
        <View style={styles.card}>
          <DetailRow icon="calendar-outline" label="Edad" value={`${query.data.age_months} meses`} />
          <View style={styles.divider} />
          <DetailRow icon="person-outline" label="Sexo" value={query.data.sex === 'F' ? 'Femenino' : 'Masculino'} />
          <View style={styles.divider} />
          <DetailRow icon="scale-outline" label="Peso" value={query.data.weight ? `${query.data.weight} kg` : 'Sin registrar'} />
          <View style={styles.divider} />
          <DetailRow icon="resize-outline" label="Talla" value={query.data.height ? `${query.data.height} cm` : 'Sin registrar'} />
          <View style={styles.divider} />
          <DetailRow icon="people-outline" label="Tutor" value={query.data.guardian_name ?? 'Sin registrar'} />
        </View>
        <View style={styles.note}><Ionicons color={colors.primaryDark} name="shield-checkmark-outline" size={21} /><Text style={styles.noteText}>La información clínica se consulta de forma segura desde el servidor.</Text></View>
        {canWrite && query.data.active && <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/(authenticated)/patients/edit/[patientId]', params: { patientId } })} style={styles.editButton}><Ionicons color={colors.onPrimary} name="create-outline" size={20} /><Text style={styles.editText}>Editar paciente</Text></Pressable>
          <Pressable accessibilityRole="button" disabled={deactivate.isPending} onPress={confirmDeactivate} style={styles.deactivateButton}><Ionicons color={colors.danger} name="archive-outline" size={19} /><Text style={styles.deactivateText}>{deactivate.isPending ? 'Desactivando…' : 'Desactivar paciente'}</Text></Pressable>
          {deactivate.isError && <Text accessibilityRole="alert" style={styles.error}>No fue posible desactivar al paciente.</Text>}
        </View>}
      </ScrollView>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 }, container: { padding: 22, paddingBottom: 38 }, identity: { alignItems: 'center', paddingVertical: 16 },
  avatar: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 28, height: 76, justifyContent: 'center', width: 76 }, name: { color: colors.text, fontSize: 25, fontWeight: '800', marginTop: 14, textAlign: 'center' },
  status: { alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 999, flexDirection: 'row', gap: 6, marginTop: 10, paddingHorizontal: 10, paddingVertical: 6 }, statusDot: { backgroundColor: colors.success, borderRadius: 4, height: 7, width: 7 }, statusText: { color: colors.success, fontSize: 11, fontWeight: '800' },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, marginTop: 16, padding: 19 }, row: { alignItems: 'center', flexDirection: 'row', gap: 13, paddingVertical: 8 }, rowIcon: { alignItems: 'center', backgroundColor: colors.primaryPale, borderRadius: 11, height: 39, justifyContent: 'center', width: 39 }, label: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }, value: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 3 }, divider: { backgroundColor: colors.border, height: 1, marginVertical: 6 },
  note: { alignItems: 'center', backgroundColor: colors.accentSoft, borderRadius: 17, flexDirection: 'row', gap: 11, marginTop: 18, padding: 16 }, noteText: { color: colors.textMuted, flex: 1, fontSize: 12, lineHeight: 18 },
  actions: { gap: 11, marginTop: 20 }, editButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 15, flexDirection: 'row', gap: 8, justifyContent: 'center', padding: 15 }, editText: { color: colors.onPrimary, fontSize: 14, fontWeight: '800' }, deactivateButton: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 15, borderWidth: 1, flexDirection: 'row', gap: 8, justifyContent: 'center', padding: 14 }, deactivateText: { color: colors.danger, fontSize: 13, fontWeight: '800' }, error: { color: colors.danger, fontSize: 12, textAlign: 'center' },
});

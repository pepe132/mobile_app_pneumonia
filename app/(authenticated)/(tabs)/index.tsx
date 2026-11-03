import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageHeader } from '@/src/components/PageHeader';
import { useSession } from '@/src/features/auth/SessionContext';
import { patientsApi } from '@/src/features/patients/api';
import { colors } from '@/src/theme/colors';

export default function DashboardScreen() {
  const { user } = useSession();
  const patients = useQuery({ queryKey: ['patients', 'summary'], queryFn: () => patientsApi.list({ pageSize: 1 }) });
  const canWrite = user?.role_id === 1 || user?.role_id === 2;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <PageHeader eyebrow="ESPACIO CLÍNICO" title={`Hola, ${user?.user_name ?? 'doctor'}`} subtitle="Todo listo para continuar con la atención de hoy." action={<View style={styles.avatar}><Ionicons color={colors.primaryDark} name="medical" size={23} /></View>} />

        <View style={styles.hero}>
          <View style={styles.heroIcon}><Ionicons color={colors.primaryDark} name="heart" size={26} /></View>
          <Text style={styles.heroTitle}>Cuidado claro, decisiones acompañadas</Text>
          <Text style={styles.heroText}>Captura variables clínicas y obtén una clasificación de severidad desde un solo lugar.</Text>
          {canWrite && <Link href="/(authenticated)/classifications/select-patient" asChild><Pressable style={styles.heroButton}><Ionicons color={colors.primaryDark} name="pulse" size={19} /><Text style={styles.heroButtonText}>Nueva clasificación</Text></Pressable></Link>}
        </View>

        <Text style={styles.sectionTitle}>Resumen</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.skyCard]}><Text style={styles.statValue}>{patients.data?.total ?? '—'}</Text><Text style={styles.statLabel}>Pacientes activos</Text></View>
          <View style={[styles.statCard, styles.lavenderCard]}><Text style={styles.statValue}>—</Text><Text style={styles.statLabel}>Clasificaciones</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        <View style={styles.actions}>
          <Link href="/(authenticated)/(tabs)/patients" asChild>
            <Pressable style={styles.action}><View style={styles.actionIcon}><Ionicons color={colors.primaryDark} name="people" size={22} /></View><View style={styles.actionCopy}><Text style={styles.actionTitle}>Ver pacientes</Text><Text style={styles.actionText}>Seleccionar un paciente para clasificar</Text></View><Ionicons color={colors.textSubtle} name="chevron-forward" size={20} /></Pressable>
          </Link>
          {canWrite && <View style={styles.action}><View style={[styles.actionIcon, styles.peachCard]}><Ionicons color={colors.primaryDark} name="person-add" size={21} /></View><View style={styles.actionCopy}><Text style={styles.actionTitle}>Nuevo paciente</Text><Text style={styles.actionText}>Disponible en el siguiente bloque</Text></View></View>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 }, container: { padding: 22, paddingBottom: 36 },
  avatar: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 16, height: 48, justifyContent: 'center', width: 48 },
  hero: { backgroundColor: colors.primary, borderRadius: 24, marginTop: 26, overflow: 'hidden', padding: 24 },
  heroIcon: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 15, height: 46, justifyContent: 'center', width: 46 },
  heroTitle: { color: colors.onPrimary, fontSize: 21, fontWeight: '800', lineHeight: 27, marginTop: 18 }, heroText: { color: '#EAF8FF', fontSize: 14, lineHeight: 21, marginTop: 7 },
  heroButton: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.surface, borderRadius: 13, flexDirection: 'row', gap: 7, marginTop: 17, paddingHorizontal: 14, paddingVertical: 11 }, heroButtonText: { color: colors.primaryDark, fontSize: 13, fontWeight: '800' },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 12, marginTop: 26 }, statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { borderRadius: 20, flex: 1, minHeight: 116, padding: 18 }, skyCard: { backgroundColor: colors.primarySoft }, lavenderCard: { backgroundColor: colors.lavenderSoft },
  statValue: { color: colors.text, fontSize: 30, fontWeight: '800' }, statLabel: { color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 7 }, actions: { gap: 12 },
  action: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 13, padding: 15 },
  actionIcon: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 13, height: 44, justifyContent: 'center', width: 44 }, peachCard: { backgroundColor: colors.peachSoft },
  actionCopy: { flex: 1 }, actionTitle: { color: colors.text, fontSize: 15, fontWeight: '800' }, actionText: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
});

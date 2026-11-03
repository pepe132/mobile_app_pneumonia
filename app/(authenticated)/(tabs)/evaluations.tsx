import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageHeader } from '@/src/components/PageHeader';
import { ScreenState } from '@/src/components/ScreenState';
import { evaluationsApi } from '@/src/features/evaluations/api';
import type { Severity } from '@/src/features/evaluations/types';
import { useSession } from '@/src/features/auth/SessionContext';
import { colors } from '@/src/theme/colors';

const severityStyle: Record<Severity, { background: string; foreground: string }> = {
  Bajo: { background: colors.successSoft, foreground: colors.success },
  Medio: { background: colors.peachSoft, foreground: '#A85D00' },
  Alto: { background: colors.dangerSoft, foreground: colors.danger },
};

export default function EvaluationsScreen() {
  const { user } = useSession();
  const canClassify = user?.role_id === 1 || user?.role_id === 2;
  const query = useQuery({ queryKey: ['evaluations', 'recent'], queryFn: () => evaluationsApi.list(1, 20) });
  return <SafeAreaView style={styles.safeArea} edges={['top']}>
    <FlatList contentContainerStyle={styles.container} data={query.data?.items ?? []} keyExtractor={(item) => item.evaluation_id}
      ListHeaderComponent={<View><PageHeader eyebrow="CLASIFICACIÓN" title="Resultados" subtitle="Consulta las clasificaciones de severidad generadas." action={canClassify ? <Link href="/(authenticated)/classifications/select-patient" asChild><Pressable accessibilityLabel="Nueva clasificación" style={styles.addButton}><Ionicons color={colors.onPrimary} name="add" size={25} /></Pressable></Link> : null} />{canClassify && <Link href="/(authenticated)/classifications/select-patient" asChild><Pressable style={styles.primaryAction}><Ionicons color={colors.onPrimary} name="pulse" size={21} /><Text style={styles.primaryActionText}>Nueva clasificación</Text></Pressable></Link>}<Text style={styles.count}>{query.data ? `${query.data.total} resultados` : 'Consultando resultados'}</Text></View>}
      ListEmptyComponent={query.isLoading ? <ScreenState kind="loading" /> : <ScreenState kind={query.isError ? 'error' : 'empty'} message={query.isError ? 'No fue posible cargar los resultados.' : 'Aún no hay clasificaciones registradas.'} />}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      renderItem={({ item }) => { const severity = item.severity_tabular; const palette = severity ? severityStyle[severity] : { background: colors.primaryPale, foreground: colors.textMuted }; return <Link href={{ pathname: '/(authenticated)/classifications/[evaluationId]', params: { evaluationId: item.evaluation_id } }} asChild><Pressable style={styles.card}><View style={[styles.badge, { backgroundColor: palette.background }]}><Text style={[styles.badgeText, { color: palette.foreground }]}>{severity ?? 'Pendiente'}</Text></View><View style={styles.cardCopy}><Text style={styles.cardTitle}>Clasificación de severidad</Text><Text style={styles.cardMeta}>{new Date(item.created_at).toLocaleString('es-MX')}</Text></View><Ionicons color={colors.textSubtle} name="chevron-forward" size={20} /></Pressable></Link>; }}
    />
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safeArea: { backgroundColor: colors.background, flex: 1 }, container: { flexGrow: 1, padding: 22, paddingBottom: 34 }, addButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 15, height: 46, justifyContent: 'center', width: 46 }, primaryAction: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 16, flexDirection: 'row', gap: 9, justifyContent: 'center', marginTop: 22, padding: 15 }, primaryActionText: { color: colors.onPrimary, fontSize: 14, fontWeight: '800' }, count: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 13, marginTop: 19 }, card: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 15 }, badge: { alignItems: 'center', borderRadius: 12, minWidth: 67, paddingHorizontal: 10, paddingVertical: 9 }, badgeText: { fontSize: 12, fontWeight: '900' }, cardCopy: { flex: 1 }, cardTitle: { color: colors.text, fontSize: 14, fontWeight: '800' }, cardMeta: { color: colors.textMuted, fontSize: 11, marginTop: 5 } });

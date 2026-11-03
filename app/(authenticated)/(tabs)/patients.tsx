import { Ionicons } from '@expo/vector-icons';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenState } from '@/src/components/ScreenState';
import { PageHeader } from '@/src/components/PageHeader';
import { patientsApi } from '@/src/features/patients/api';
import type { Patient } from '@/src/features/patients/types';
import { useSession } from '@/src/features/auth/SessionContext';
import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import { colors } from '@/src/theme/colors';

const PAGE_SIZE = 10;

function patientAge(months: number) {
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  return remaining ? `${years} a ${remaining} m` : `${years} ${years === 1 ? 'año' : 'años'}`;
}

function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Link href={{ pathname: '/(authenticated)/patients/[patientId]', params: { patientId: patient.patient_id } }} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={[styles.patientIcon, { backgroundColor: patient.sex === 'F' ? colors.lavenderSoft : colors.primarySoft }]}>
          <Ionicons color={colors.primaryDark} name="happy-outline" size={24} />
        </View>
        <View style={styles.cardCopy}>
          <Text numberOfLines={1} style={styles.patientName}>{patient.full_name}</Text>
          <Text style={styles.patientMeta}>{patientAge(patient.age_months)} · {patient.sex === 'F' ? 'Niña' : 'Niño'}</Text>
          {patient.guardian_name && <Text numberOfLines={1} style={styles.guardian}>Tutor: {patient.guardian_name}</Text>}
        </View>
        <Ionicons color={colors.textSubtle} name="chevron-forward" size={20} />
      </Pressable>
    </Link>
  );
}

export default function PatientsScreen() {
  const { user } = useSession();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const query = useQuery({
    queryKey: ['patients', { page, search: debouncedSearch }],
    queryFn: () => patientsApi.list({ page, pageSize: PAGE_SIZE, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => setPage(1), [debouncedSearch]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        contentContainerStyle={styles.container}
        data={query.data?.items ?? []}
        keyExtractor={(item) => item.patient_id}
        ListHeaderComponent={<View><PageHeader eyebrow="PACIENTES" title="Pequeños pacientes" subtitle="Busca y consulta su información clínica." action={user?.role_id !== 3 ? <Link href="/(authenticated)/patients/new" asChild><Pressable accessibilityLabel="Registrar paciente" style={styles.addButton}><Ionicons color={colors.onPrimary} name="add" size={25} /></Pressable></Link> : null} /><View style={styles.searchBox}><Ionicons color={colors.textSubtle} name="search" size={20} /><TextInput accessibilityLabel="Buscar pacientes" autoCapitalize="words" onChangeText={setSearch} placeholder="Buscar por nombre" placeholderTextColor={colors.textSubtle} style={styles.searchInput} value={search} />{search.length > 0 && <Pressable accessibilityLabel="Limpiar búsqueda" onPress={() => setSearch('')}><Ionicons color={colors.textMuted} name="close-circle" size={20} /></Pressable>}</View><Text style={styles.count}>{query.data ? `${query.data.total} pacientes` : 'Consultando pacientes'}</Text></View>}
        ListEmptyComponent={query.isLoading ? <ScreenState kind="loading" /> : query.isError ? <ScreenState kind="error" message="No pudimos cargar los pacientes. Desliza o intenta nuevamente." /> : <ScreenState kind="empty" message={debouncedSearch ? 'No encontramos pacientes con ese nombre.' : 'Todavía no hay pacientes registrados.'} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <PatientCard patient={item} />}
        ListFooterComponent={query.data && query.data.pages > 1 ? <View style={styles.pagination}><Pressable disabled={page === 1 || query.isFetching} onPress={() => setPage((value) => value - 1)} style={[styles.pageButton, page === 1 && styles.disabled]}><Ionicons color={colors.primaryDark} name="chevron-back" size={18} /><Text style={styles.pageButtonText}>Anterior</Text></Pressable><Text style={styles.pageLabel}>{page} de {query.data.pages}</Text><Pressable disabled={page === query.data.pages || query.isFetching} onPress={() => setPage((value) => value + 1)} style={[styles.pageButton, page === query.data.pages && styles.disabled]}><Text style={styles.pageButtonText}>Siguiente</Text><Ionicons color={colors.primaryDark} name="chevron-forward" size={18} /></Pressable></View> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 }, container: { flexGrow: 1, padding: 22, paddingBottom: 32 },
  addButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 15, height: 46, justifyContent: 'center', width: 46 },
  searchBox: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: 24, paddingHorizontal: 15 },
  searchInput: { color: colors.text, flex: 1, fontSize: 15, paddingVertical: 14 }, count: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 13, marginTop: 16 },
  card: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 13, padding: 15 }, pressed: { opacity: 0.72 },
  patientIcon: { alignItems: 'center', borderRadius: 15, height: 50, justifyContent: 'center', width: 50 }, cardCopy: { flex: 1 }, patientName: { color: colors.text, fontSize: 16, fontWeight: '800' },
  patientMeta: { color: colors.textMuted, fontSize: 13, marginTop: 5 }, guardian: { color: colors.textSubtle, fontSize: 12, marginTop: 4 }, separator: { height: 11 },
  pagination: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 }, pageButton: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 12, flexDirection: 'row', gap: 3, paddingHorizontal: 12, paddingVertical: 10 }, disabled: { opacity: 0.35 }, pageButtonText: { color: colors.primaryDark, fontSize: 12, fontWeight: '800' }, pageLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
});

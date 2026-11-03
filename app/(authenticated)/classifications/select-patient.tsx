import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenState } from '@/src/components/ScreenState';
import { patientsApi } from '@/src/features/patients/api';
import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import { colors } from '@/src/theme/colors';

export default function SelectPatientScreen() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const query = useQuery({ queryKey: ['patients', 'classification', debouncedSearch], queryFn: () => patientsApi.list({ pageSize: 50, search: debouncedSearch }) });
  return <SafeAreaView edges={['bottom']} style={styles.safeArea}>
    <Stack.Screen options={{ headerShown: true, title: 'Nueva clasificación', headerBackTitle: 'Atrás' }} />
    <FlatList contentContainerStyle={styles.container} data={query.data?.items ?? []} keyExtractor={(item) => item.patient_id}
      ListHeaderComponent={<View><Text style={styles.title}>Selecciona al paciente</Text><Text style={styles.subtitle}>La clasificación quedará asociada a su expediente.</Text><View style={styles.search}><Ionicons color={colors.textSubtle} name="search" size={20} /><TextInput onChangeText={setSearch} placeholder="Buscar por nombre" placeholderTextColor={colors.textSubtle} style={styles.searchInput} value={search} /></View></View>}
      ListEmptyComponent={query.isLoading ? <ScreenState kind="loading" /> : <ScreenState kind={query.isError ? 'error' : 'empty'} message={query.isError ? 'No fue posible consultar los pacientes.' : 'No encontramos pacientes activos.'} />}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      renderItem={({ item }) => <Pressable onPress={() => router.push({ pathname: '/(authenticated)/classifications/new/[patientId]', params: { patientId: item.patient_id } })} style={({ pressed }) => [styles.patient, pressed && styles.pressed]}><View style={styles.icon}><Ionicons color={colors.primaryDark} name="happy-outline" size={23} /></View><View style={styles.copy}><Text numberOfLines={1} style={styles.name}>{item.full_name}</Text><Text style={styles.meta}>{item.age_months} meses · {item.weight ? `${item.weight} kg` : 'Peso pendiente'}</Text></View><Ionicons color={colors.textSubtle} name="chevron-forward" size={20} /></Pressable>}
    />
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safeArea: { backgroundColor: colors.background, flex: 1 }, container: { flexGrow: 1, padding: 22, paddingBottom: 36 }, title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 8 }, subtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 7 }, search: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 15, borderWidth: 1, flexDirection: 'row', gap: 9, marginBottom: 18, marginTop: 20, paddingHorizontal: 14 }, searchInput: { color: colors.text, flex: 1, fontSize: 14, paddingVertical: 14 }, patient: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 14 }, pressed: { opacity: 0.68 }, icon: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 14, height: 47, justifyContent: 'center', width: 47 }, copy: { flex: 1 }, name: { color: colors.text, fontSize: 15, fontWeight: '800' }, meta: { color: colors.textMuted, fontSize: 12, marginTop: 5 } });

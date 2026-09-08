import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageHeader } from '@/src/components/PageHeader';
import { colors } from '@/src/theme/colors';

export default function EvaluationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <PageHeader eyebrow="SEGUIMIENTO" title="Evaluaciones" subtitle="Historial clínico y resultados de apoyo." />
        <View style={styles.emptyCard}>
          <View style={styles.icon}><Ionicons color={colors.primaryDark} name="clipboard-outline" size={30} /></View>
          <Text style={styles.title}>El siguiente módulo</Text>
          <Text style={styles.text}>Aquí integraremos evaluaciones clínicas, probabilidades y radiografías.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 }, container: { flex: 1, padding: 22 }, emptyCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, marginTop: 34, padding: 30 },
  icon: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 20, height: 62, justifyContent: 'center', width: 62 }, title: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 18 }, text: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
});

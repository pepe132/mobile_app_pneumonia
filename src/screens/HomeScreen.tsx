import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>BASE INICIAL LISTA</Text>
      </View>
      <Text style={styles.title}>Neumonía Pediátrica</Text>
      <Text style={styles.subtitle}>
        Aplicación de apoyo para pacientes, evaluaciones clínicas y radiografías.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Siguiente paso</Text>
        <Text style={styles.cardText}>
          Configurar la URL del backend y construir el flujo de inicio de sesión.
        </Text>
      </View>
      <Text style={styles.disclaimer}>
        Herramienta de apoyo. No sustituye el criterio del personal médico.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.primarySoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { color: colors.primaryDark, fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', marginTop: 18 },
  subtitle: { color: colors.textMuted, fontSize: 17, lineHeight: 25, marginTop: 10 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, marginTop: 32, padding: 20 },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  cardText: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  disclaimer: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 24 },
});

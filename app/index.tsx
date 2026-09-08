import { Link, Redirect } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';
import { ScreenState } from '@/src/components/ScreenState';
import { useSession } from '@/src/features/auth/SessionContext';

export default function WelcomeScreen() {
  const { status } = useSession();

  if (status === 'loading') return <ScreenState kind="loading" message="Restaurando sesión…" />;
  if (status === 'authenticated') return <Redirect href="/(authenticated)" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PLATAFORMA CLÍNICA</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Neumonía pediátrica</Text>
          <Text style={styles.subtitle}>
            Apoyo inteligente para organizar pacientes, evaluaciones clínicas y resultados radiográficos.
          </Text>
        </View>
        <Link href="/(public)/login" asChild>
          <Pressable accessibilityRole="button" style={styles.button}>
            <Text style={styles.buttonText}>Ingresar a la plataforma</Text>
          </Pressable>
        </Link>
        <Text style={styles.disclaimer}>
          Herramienta de apoyo. No sustituye el criterio del personal médico.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  container: { flex: 1, justifyContent: 'center', padding: 28 },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.primarySoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  badgeText: { color: colors.primaryDark, fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  copy: { gap: 14, marginBottom: 40, marginTop: 24 },
  title: { color: colors.text, fontSize: 38, fontWeight: '800', letterSpacing: -1.2 },
  subtitle: { color: colors.textMuted, fontSize: 17, lineHeight: 26 },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, padding: 17 },
  buttonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  disclaimer: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 24, textAlign: 'center' },
});

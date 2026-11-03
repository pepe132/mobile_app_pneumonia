import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type ScreenStateProps = {
  kind: 'loading' | 'empty' | 'error';
  message?: string;
};

export function ScreenState({ kind, message }: ScreenStateProps) {
  const defaultMessage = {
    loading: 'Cargando con cuidado…',
    empty: 'Todavía no hay información disponible.',
    error: 'Algo salió mal. Intenta nuevamente.',
  }[kind];

  return (
    <View style={styles.container}>
      {kind === 'loading' && <ActivityIndicator color={colors.primary} />}
      <Text style={[styles.text, kind === 'error' && styles.error]}>{message ?? defaultMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 12, justifyContent: 'center', padding: 24 },
  text: { color: colors.textMuted, textAlign: 'center' },
  error: { color: colors.danger },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageHeader } from '@/src/components/PageHeader';
import { useSession } from '@/src/features/auth/SessionContext';
import { colors } from '@/src/theme/colors';

export default function ProfileScreen() {
  const { logout, user } = useSession();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <PageHeader eyebrow="TU CUENTA" title="Perfil" subtitle="Sesión y permisos de la plataforma." />
        <View style={styles.card}>
          <View style={styles.avatar}><Ionicons color={colors.primaryDark} name="medical" size={31} /></View>
          <Text style={styles.name}>{user?.user_name}</Text><Text style={styles.email}>{user?.email}</Text>
          <View style={styles.role}><Ionicons color={colors.primaryDark} name="shield-checkmark" size={15} /><Text style={styles.roleText}>{user?.role_name ?? `Rol ${user?.role_id}`}</Text></View>
        </View>
        <Pressable accessibilityRole="button" onPress={() => void logout()} style={styles.logout}><Ionicons color={colors.danger} name="log-out-outline" size={21} /><Text style={styles.logoutText}>Cerrar sesión</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 }, container: { flex: 1, padding: 22 }, card: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, marginTop: 28, padding: 28 }, avatar: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 28, height: 76, justifyContent: 'center', width: 76 }, name: { color: colors.text, fontSize: 21, fontWeight: '800', marginTop: 16 }, email: { color: colors.textMuted, fontSize: 14, marginTop: 5 }, role: { alignItems: 'center', backgroundColor: colors.primaryPale, borderRadius: 999, flexDirection: 'row', gap: 6, marginTop: 16, paddingHorizontal: 12, paddingVertical: 7 }, roleText: { color: colors.primaryDark, fontSize: 12, fontWeight: '800' }, logout: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 9, justifyContent: 'center', marginTop: 18, padding: 16 }, logoutText: { color: colors.danger, fontSize: 15, fontWeight: '800' },
});

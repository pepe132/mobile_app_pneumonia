import { Redirect, Stack } from 'expo-router';

import { ScreenState } from '@/src/components/ScreenState';
import { useSession } from '@/src/features/auth/SessionContext';

export default function AuthenticatedLayout() {
  const { status } = useSession();
  if (status === 'loading') return <ScreenState kind="loading" message="Restaurando sesión…" />;
  if (status === 'unauthenticated') return <Redirect href="/(public)/login" />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="patients" />
      <Stack.Screen name="classifications" />
    </Stack>
  );
}

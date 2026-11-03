import { Redirect, Stack } from 'expo-router';

import { ScreenState } from '@/src/components/ScreenState';
import { useSession } from '@/src/features/auth/SessionContext';

export default function PublicLayout() {
  const { status } = useSession();
  if (status === 'loading') return <ScreenState kind="loading" message="Restaurando sesión…" />;
  if (status === 'authenticated') return <Redirect href="/(authenticated)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

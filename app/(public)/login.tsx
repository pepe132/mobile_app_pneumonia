import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { ApiError } from '@/src/api/client';
import { useSession } from '@/src/features/auth/SessionContext';
import { loginSchema, type LoginFormValues } from '@/src/features/auth/schema';
import { colors } from '@/src/theme/colors';

export default function LoginScreen() {
  const { login } = useSession();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', user_password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login({ email: values.email.trim().toLowerCase(), user_password: values.user_password });
    } catch (error) {
      setError('root', {
        message: error instanceof ApiError
          ? error.message
          : 'No fue posible conectar con el servidor. Revisa que FastAPI esté disponible.',
      });
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>ACCESO SEGURO</Text>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.description}>Ingresa con la cuenta proporcionada por tu organización.</Text>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Correo electrónico</Text>
              <Controller control={control} name="email" render={({ field: { onBlur, onChange, value } }) => (
                <TextInput accessibilityLabel="Correo electrónico" autoCapitalize="none" autoComplete="email" editable={!isSubmitting} inputMode="email" onBlur={onBlur} onChangeText={onChange} placeholder="medico@organizacion.com" placeholderTextColor={colors.textSubtle} style={[styles.input, errors.email && styles.inputError]} value={value} />
              )} />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Contraseña</Text>
              <Controller control={control} name="user_password" render={({ field: { onBlur, onChange, value } }) => (
                <View style={[styles.passwordInputContainer, errors.user_password && styles.inputError]}>
                  <TextInput accessibilityLabel="Contraseña" autoCapitalize="none" autoComplete="current-password" editable={!isSubmitting} onBlur={onBlur} onChangeText={onChange} placeholder="Mínimo 8 caracteres" placeholderTextColor={colors.textSubtle} secureTextEntry={!isPasswordVisible} style={styles.passwordInput} value={value} />
                  <Pressable
                    accessibilityLabel={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isSubmitting }}
                    disabled={isSubmitting}
                    hitSlop={8}
                    onPress={() => setIsPasswordVisible((visible) => !visible)}
                    style={styles.visibilityButton}
                  >
                    <Ionicons color={colors.textMuted} name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={21} />
                  </Pressable>
                </View>
              )} />
              {errors.user_password && <Text style={styles.errorText}>{errors.user_password.message}</Text>}
            </View>
            {errors.root && <Text accessibilityRole="alert" style={styles.serverError}>{errors.root.message}</Text>}
            <Pressable accessibilityRole="button" disabled={isSubmitting} onPress={onSubmit} style={({ pressed }) => [styles.button, (pressed || isSubmitting) && styles.buttonPressed]}>
              <Text style={styles.buttonText}>{isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}</Text>
            </Pressable>
          </View>
          <Text style={styles.disclaimer}>Tus credenciales se almacenan de forma segura en el dispositivo.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { backgroundColor: colors.background, flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  title: { color: colors.text, fontSize: 36, fontWeight: '800', marginTop: 12 },
  description: { color: colors.textMuted, fontSize: 16, lineHeight: 24, marginTop: 12 },
  form: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, gap: 20, marginTop: 32, padding: 22 },
  field: { gap: 8 },
  label: { color: colors.text, fontSize: 14, fontWeight: '700' },
  input: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, fontSize: 16, paddingHorizontal: 14, paddingVertical: 14 },
  passwordInputContainer: { alignItems: 'center', backgroundColor: colors.background, borderColor: colors.border, borderRadius: 12, borderWidth: 1, flexDirection: 'row' },
  passwordInput: { color: colors.text, flex: 1, fontSize: 16, paddingHorizontal: 14, paddingVertical: 14 },
  visibilityButton: { paddingHorizontal: 14, paddingVertical: 12 },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 12 },
  serverError: { backgroundColor: colors.dangerSoft, borderRadius: 10, color: colors.danger, fontSize: 13, lineHeight: 19, padding: 12 },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, padding: 16 },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '800' },
  disclaimer: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 20, textAlign: 'center' },
});

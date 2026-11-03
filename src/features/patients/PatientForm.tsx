import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../theme/colors';
import { patientFormSchema, type PatientFormValues } from './schema';
import type { PatientCreatePayload, PatientSex } from './types';

type PatientFormProps = {
  defaultValues?: PatientFormValues;
  errorMessage?: string;
  isSubmitting: boolean;
  onSubmit: (payload: PatientCreatePayload) => Promise<void>;
  submitLabel: string;
};

const emptyValues: PatientFormValues = { full_name: '', age_months: '', sex: 'M', weight: '', height: '', guardian_name: '' };

function FieldError({ message }: { message?: string }) {
  return message ? <Text style={styles.errorText}>{message}</Text> : null;
}

export function PatientForm({ defaultValues = emptyValues, errorMessage, isSubmitting, onSubmit, submitLabel }: PatientFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<PatientFormValues>({ resolver: zodResolver(patientFormSchema), defaultValues });
  const submit = handleSubmit(async (values) => onSubmit({
    full_name: values.full_name.trim(),
    age_months: Number(values.age_months),
    sex: values.sex,
    weight: values.weight ? Number(values.weight) : null,
    height: values.height ? Number(values.height) : null,
    guardian_name: values.guardian_name.trim() || null,
  }));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}><Text style={styles.introTitle}>Datos del pequeño paciente</Text><Text style={styles.introText}>Registra información básica antes de iniciar una evaluación clínica.</Text></View>
        <View style={styles.form}>
          <Controller control={control} name="full_name" render={({ field: { onBlur, onChange, value } }) => <View style={styles.field}><Text style={styles.label}>Nombre completo *</Text><TextInput onBlur={onBlur} onChangeText={onChange} value={value} autoCapitalize="words" editable={!isSubmitting} placeholder="Nombre y apellidos" placeholderTextColor={colors.textSubtle} style={[styles.input, errors.full_name && styles.inputError]} /><FieldError message={errors.full_name?.message} /></View>} />
          <Controller control={control} name="age_months" render={({ field: { onBlur, onChange, value } }) => <View style={styles.field}><Text style={styles.label}>Edad en meses *</Text><TextInput onBlur={onBlur} onChangeText={onChange} value={value} editable={!isSubmitting} inputMode="numeric" maxLength={2} placeholder="0 a 72" placeholderTextColor={colors.textSubtle} style={[styles.input, errors.age_months && styles.inputError]} /><FieldError message={errors.age_months?.message} /></View>} />
          <Controller control={control} name="sex" render={({ field }) => <View style={styles.field}><Text style={styles.label}>Sexo *</Text><View style={styles.options}>{(['M', 'F'] as PatientSex[]).map((value) => <Pressable key={value} disabled={isSubmitting} onPress={() => field.onChange(value)} style={[styles.option, field.value === value && styles.optionSelected]}><Text style={[styles.optionText, field.value === value && styles.optionTextSelected]}>{value === 'M' ? 'Niño' : 'Niña'}</Text></Pressable>)}</View></View>} />
          <View style={styles.row}>
            <Controller control={control} name="weight" render={({ field: { onBlur, onChange, value } }) => <View style={[styles.field, styles.half]}><Text style={styles.label}>Peso (kg)</Text><TextInput onBlur={onBlur} onChangeText={onChange} value={value} editable={!isSubmitting} inputMode="decimal" placeholder="Ej. 18.5" placeholderTextColor={colors.textSubtle} style={[styles.input, errors.weight && styles.inputError]} /><FieldError message={errors.weight?.message} /></View>} />
            <Controller control={control} name="height" render={({ field: { onBlur, onChange, value } }) => <View style={[styles.field, styles.half]}><Text style={styles.label}>Talla (cm)</Text><TextInput onBlur={onBlur} onChangeText={onChange} value={value} editable={!isSubmitting} inputMode="decimal" placeholder="Ej. 105" placeholderTextColor={colors.textSubtle} style={[styles.input, errors.height && styles.inputError]} /><FieldError message={errors.height?.message} /></View>} />
          </View>
          <Controller control={control} name="guardian_name" render={({ field: { onBlur, onChange, value } }) => <View style={styles.field}><Text style={styles.label}>Madre, padre o tutor</Text><TextInput onBlur={onBlur} onChangeText={onChange} value={value} autoCapitalize="words" editable={!isSubmitting} placeholder="Nombre del responsable" placeholderTextColor={colors.textSubtle} style={[styles.input, errors.guardian_name && styles.inputError]} /><FieldError message={errors.guardian_name?.message} /></View>} />
          {errorMessage && <Text accessibilityRole="alert" style={styles.serverError}>{errorMessage}</Text>}
          <Pressable accessibilityRole="button" disabled={isSubmitting} onPress={submit} style={({ pressed }) => [styles.button, (pressed || isSubmitting) && styles.buttonPressed]}><Text style={styles.buttonText}>{isSubmitting ? 'Guardando…' : submitLabel}</Text></Pressable>
        </View>
        <Text style={styles.required}>* Campos obligatorios</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, container: { padding: 22, paddingBottom: 42 }, intro: { backgroundColor: colors.primarySoft, borderRadius: 20, padding: 20 }, introTitle: { color: colors.text, fontSize: 18, fontWeight: '800' }, introText: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 7 },
  form: { gap: 20, marginTop: 24 }, field: { flex: 1, gap: 8 }, label: { color: colors.text, fontSize: 13, fontWeight: '800' }, input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.text, fontSize: 15, paddingHorizontal: 14, paddingVertical: 14 }, inputError: { borderColor: colors.danger }, errorText: { color: colors.danger, fontSize: 11, lineHeight: 16 },
  options: { flexDirection: 'row', gap: 10 }, option: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, flex: 1, padding: 14 }, optionSelected: { backgroundColor: colors.primarySoft, borderColor: colors.primary }, optionText: { color: colors.textMuted, fontSize: 14, fontWeight: '700' }, optionTextSelected: { color: colors.primaryDark }, row: { flexDirection: 'row', gap: 12 }, half: { minWidth: 0 },
  serverError: { backgroundColor: colors.dangerSoft, borderRadius: 12, color: colors.danger, fontSize: 12, lineHeight: 18, padding: 13 }, button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 15, marginTop: 4, padding: 16 }, buttonPressed: { opacity: 0.65 }, buttonText: { color: colors.onPrimary, fontSize: 15, fontWeight: '800' }, required: { color: colors.textSubtle, fontSize: 11, marginTop: 15, textAlign: 'center' },
});

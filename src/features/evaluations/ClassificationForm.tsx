import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Controller, type Control, type FieldPath, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { colors } from '../../theme/colors';
import { classificationFormSchema, type ClassificationFormValues } from './schema';
import type { EvaluationPayload } from './types';

export type SelectedRadiograph = { uri: string; name: string; type: string };

type Props = {
  patientId: string;
  patientName: string;
  ageMonths: number;
  weight: number | null;
  errorMessage?: string;
  isSubmitting: boolean;
  onSubmit: (payload: EvaluationPayload, radiograph?: SelectedRadiograph) => Promise<void>;
};

const booleanFields: Array<{ title: string; fields: Array<{ name: FieldPath<ClassificationFormValues>; label: string }> }> = [
  { title: 'Trabajo respiratorio', fields: [
    { name: 'tiraje', label: 'Tiraje' }, { name: 'retraccion_xifoidea', label: 'Retracción xifoidea' },
    { name: 'disociacion_toracoabdominal', label: 'Disociación toracoabdominal' }, { name: 'aleteo_nasal', label: 'Aleteo nasal' },
    { name: 'quejido_espiratorio', label: 'Quejido espiratorio' },
  ] },
  { title: 'Signos de alarma', fields: [
    { name: 'cianosis', label: 'Cianosis' }, { name: 'apnea', label: 'Apnea' }, { name: 'rechazo_comer', label: 'Rechazo a comer' },
    { name: 'vomita_todo', label: 'Vomita todo' }, { name: 'convulsiones', label: 'Convulsiones' },
  ] },
  { title: 'Antecedentes y auscultación', fields: [
    { name: 'desnutricion', label: 'Desnutrición' }, { name: 'antecedentes_cronicos', label: 'Antecedentes crónicos' },
    { name: 'sibilancias', label: 'Sibilancias' }, { name: 'crepitantes', label: 'Crepitantes' },
    { name: 'disminucion_murmullo_vesicular', label: 'Disminución del murmullo vesicular' }, { name: 'dolor_toracico', label: 'Dolor torácico' },
  ] },
];

function NumericField({ control, name, label, suffix, disabled }: { control: Control<ClassificationFormValues>; name: FieldPath<ClassificationFormValues>; label: string; suffix?: string; disabled: boolean }) {
  return <Controller control={control} name={name} render={({ field: { onBlur, onChange, value }, fieldState }) => <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrap, fieldState.error && styles.inputError]}><TextInput editable={!disabled} inputMode="decimal" onBlur={onBlur} onChangeText={onChange} placeholder="0" placeholderTextColor={colors.textSubtle} style={styles.input} value={String(value)} />{suffix && <Text style={styles.suffix}>{suffix}</Text>}</View>
    {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
  </View>} />;
}

export function ClassificationForm({ patientId, patientName, ageMonths, weight, errorMessage, isSubmitting, onSubmit }: Props) {
  const [radiograph, setRadiograph] = useState<SelectedRadiograph | null>(null);
  const defaultValues: ClassificationFormValues = {
    edad_meses: String(ageMonths), peso_kg: weight == null ? '' : String(weight), fr: '', fc: '', temperatura_c: '', spo2: '', glasgow: '15',
    dias_sintomas: '0', dias_fiebre: '0', dias_tos: '0', dias_dificultad_respiratoria: '0',
    tiraje: false, retraccion_xifoidea: false, disociacion_toracoabdominal: false, aleteo_nasal: false,
    quejido_espiratorio: false, cianosis: false, apnea: false, rechazo_comer: false, vomita_todo: false,
    convulsiones: false, desnutricion: false, antecedentes_cronicos: false, sibilancias: false,
    crepitantes: false, disminucion_murmullo_vesicular: false, dolor_toracico: false,
  };
  const { control, handleSubmit } = useForm<ClassificationFormValues>({ resolver: zodResolver(classificationFormSchema), defaultValues });
  const submit = handleSubmit(async (values) => onSubmit({
    patient_id: patientId,
    ...values,
    edad_meses: Number(values.edad_meses), peso_kg: Number(values.peso_kg), fr: Number(values.fr), fc: Number(values.fc),
    temperatura_c: Number(values.temperatura_c), spo2: Number(values.spo2), glasgow: Number(values.glasgow),
    dias_sintomas: Number(values.dias_sintomas), dias_fiebre: Number(values.dias_fiebre), dias_tos: Number(values.dias_tos),
    dias_dificultad_respiratoria: Number(values.dias_dificultad_respiratoria),
  }, radiograph ?? undefined));

  async function selectRadiograph() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const type = asset.mimeType ?? 'image/jpeg';
    setRadiograph({ uri: asset.uri, name: asset.fileName ?? `radiograph.${type === 'image/png' ? 'png' : 'jpg'}`, type });
  }

  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.patientCard}><Text style={styles.eyebrow}>PACIENTE SELECCIONADO</Text><Text style={styles.patientName}>{patientName}</Text><Text style={styles.helper}>Captura los hallazgos observados para generar la clasificación.</Text></View>
      <View style={styles.section}><Text style={styles.sectionTitle}>Signos vitales</Text><View style={styles.grid}>
        <NumericField control={control} disabled={isSubmitting} label="Edad" name="edad_meses" suffix="meses" />
        <NumericField control={control} disabled={isSubmitting} label="Peso" name="peso_kg" suffix="kg" />
        <NumericField control={control} disabled={isSubmitting} label="Frecuencia respiratoria" name="fr" suffix="rpm" />
        <NumericField control={control} disabled={isSubmitting} label="Frecuencia cardiaca" name="fc" suffix="lpm" />
        <NumericField control={control} disabled={isSubmitting} label="Temperatura" name="temperatura_c" suffix="°C" />
        <NumericField control={control} disabled={isSubmitting} label="Saturación de oxígeno" name="spo2" suffix="%" />
        <NumericField control={control} disabled={isSubmitting} label="Escala de Glasgow" name="glasgow" suffix="/ 15" />
      </View></View>
      {booleanFields.map((section) => <View key={section.title} style={styles.section}><Text style={styles.sectionTitle}>{section.title}</Text>{section.fields.map((item) => <Controller key={item.name} control={control} name={item.name} render={({ field }) => <View style={styles.switchRow}><Text style={styles.switchLabel}>{item.label}</Text><Switch accessibilityLabel={item.label} disabled={isSubmitting} onValueChange={field.onChange} trackColor={{ false: colors.border, true: colors.accent }} thumbColor={field.value ? colors.primaryDark : colors.surface} value={Boolean(field.value)} /></View>} />)}</View>)}
      <View style={styles.section}><Text style={styles.sectionTitle}>Evolución de síntomas</Text><Text style={styles.sectionHelp}>Indica la duración en días.</Text><View style={styles.grid}>
        <NumericField control={control} disabled={isSubmitting} label="Síntomas" name="dias_sintomas" suffix="días" />
        <NumericField control={control} disabled={isSubmitting} label="Fiebre" name="dias_fiebre" suffix="días" />
        <NumericField control={control} disabled={isSubmitting} label="Tos" name="dias_tos" suffix="días" />
        <NumericField control={control} disabled={isSubmitting} label="Dificultad respiratoria" name="dias_dificultad_respiratoria" suffix="días" />
      </View></View>
      <View style={styles.section}><Text style={styles.sectionTitle}>Radiografía (opcional)</Text><Text style={styles.sectionHelp}>Puedes adjuntarla ahora para analizarla junto con la clasificación clínica.</Text>{radiograph && <Image accessibilityLabel="Vista previa de radiografía" source={{ uri: radiograph.uri }} style={styles.radiographPreview} />}<Pressable accessibilityRole="button" disabled={isSubmitting} onPress={selectRadiograph} style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonDisabled]}><Text style={styles.secondaryButtonText}>{radiograph ? 'Cambiar radiografía' : 'Seleccionar radiografía'}</Text></Pressable></View>
      {errorMessage && <Text accessibilityRole="alert" style={styles.serverError}>{errorMessage}</Text>}
      <View style={styles.disclaimer}><Text style={styles.disclaimerText}>La salida es un apoyo para clasificación y no sustituye el juicio clínico.</Text></View>
      <Pressable accessibilityRole="button" disabled={isSubmitting} onPress={submit} style={({ pressed }) => [styles.button, (pressed || isSubmitting) && styles.buttonDisabled]}><Text style={styles.buttonText}>{isSubmitting ? 'Clasificando…' : 'Obtener clasificación'}</Text></Pressable>
    </ScrollView>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  radiographPreview: { borderRadius: 14, height: 190, marginBottom: 14, width: '100%' }, secondaryButton: { alignItems: 'center', borderColor: colors.primary, borderRadius: 12, borderWidth: 1, padding: 13 }, secondaryButtonText: { color: colors.primaryDark, fontSize: 14, fontWeight: '800' },
  flex: { flex: 1 }, container: { padding: 20, paddingBottom: 44 }, patientCard: { backgroundColor: colors.primarySoft, borderRadius: 20, padding: 19 }, eyebrow: { color: colors.primaryDark, fontSize: 10, fontWeight: '900', letterSpacing: 1 }, patientName: { color: colors.text, fontSize: 19, fontWeight: '800', marginTop: 7 }, helper: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  section: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, marginTop: 16, padding: 17 }, sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 14 }, sectionHelp: { color: colors.textMuted, fontSize: 12, marginBottom: 13, marginTop: -7 }, grid: { gap: 14 }, field: { gap: 7 }, label: { color: colors.text, fontSize: 12, fontWeight: '700' }, inputWrap: { alignItems: 'center', backgroundColor: colors.primaryPale, borderColor: colors.border, borderRadius: 13, borderWidth: 1, flexDirection: 'row' }, input: { color: colors.text, flex: 1, fontSize: 15, paddingHorizontal: 13, paddingVertical: 13 }, suffix: { color: colors.textMuted, fontSize: 12, paddingRight: 13 }, inputError: { borderColor: colors.danger }, errorText: { color: colors.danger, fontSize: 11 },
  switchRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 52 }, switchLabel: { color: colors.text, flex: 1, fontSize: 13, paddingRight: 12 }, serverError: { backgroundColor: colors.dangerSoft, borderRadius: 13, color: colors.danger, fontSize: 12, lineHeight: 18, marginTop: 16, padding: 14 }, disclaimer: { backgroundColor: colors.accentSoft, borderRadius: 14, marginTop: 16, padding: 14 }, disclaimerText: { color: colors.textMuted, fontSize: 12, lineHeight: 18 }, button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 15, marginTop: 16, padding: 17 }, buttonDisabled: { opacity: 0.6 }, buttonText: { color: colors.onPrimary, fontSize: 15, fontWeight: '800' },
});

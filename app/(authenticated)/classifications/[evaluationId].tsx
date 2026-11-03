import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenState } from '@/src/components/ScreenState';
import { sessionStorage } from '@/src/storage/sessionStorage';
import { evaluationsApi } from '@/src/features/evaluations/api';
import { radiographsApi, type RadiographAnalysis } from '@/src/features/radiographs';
import { colors } from '@/src/theme/colors';

const severityColor = { Bajo: colors.success, Medio: '#B66A00', Alto: colors.danger } as const;

function Probability({ label, value, color }: { label: string; value: number | null; color: string }) {
  const percentage = Math.round((value ?? 0) * 100);
  return <View style={styles.probability}><View style={styles.probabilityHeader}><Text style={styles.probabilityLabel}>{label}</Text><Text style={styles.probabilityValue}>{percentage}%</Text></View><View style={styles.track}><View style={[styles.bar, { backgroundColor: color, width: `${percentage}%` }]} /></View></View>;
}

export default function ClassificationResultScreen() {
  const { evaluationId } = useLocalSearchParams<{ evaluationId: string }>();
  const query = useQuery({ queryKey: ['evaluation', evaluationId], queryFn: () => evaluationsApi.detail(evaluationId), enabled: Boolean(evaluationId) });
  const radiographQuery = useQuery({ queryKey: ['radiograph', evaluationId], queryFn: () => radiographsApi.get(evaluationId), enabled: Boolean(evaluationId) });
  const [analysis, setAnalysis] = useState<RadiographAnalysis | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const result = query.data;
  const severity = result?.severity_tabular;
  const radiograph = analysis?.radiograph ?? radiographQuery.data;
  const integratedResult = analysis?.integrated_result;

  useEffect(() => {
    sessionStorage.getAccessToken().then(setAccessToken).catch(() => setAccessToken(null));
  }, []);

  const imageUri = selectedImageUri ?? (radiograph ? `${process.env.EXPO_PUBLIC_API_URL}/api/v1/evaluations/${evaluationId}/radiograph/image` : null);
  const imageSource = imageUri ? { uri: imageUri, ...(selectedImageUri || !accessToken ? {} : { headers: { Authorization: `Bearer ${accessToken}` } }) } : null;

  async function selectAndUploadRadiograph() {
    if (!evaluationId || isUploading) return;
    setUploadError(null);
    const pickerResult = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 });
    if (pickerResult.canceled || !pickerResult.assets[0]) return;
    const asset = pickerResult.assets[0];
    const type = asset.mimeType ?? 'image/jpeg';
    const extension = type === 'image/png' ? 'png' : 'jpg';
    setSelectedImageUri(asset.uri);
    setIsUploading(true);
    try {
      const uploaded = await radiographsApi.upload(evaluationId, { uri: asset.uri, name: asset.fileName ?? `radiograph.${extension}`, type });
      setAnalysis(uploaded);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'No fue posible analizar la radiografía.');
    } finally {
      setIsUploading(false);
    }
  }

  return <SafeAreaView edges={['bottom']} style={styles.safeArea}>
    <Stack.Screen options={{ headerShown: true, title: 'Resultado', headerBackTitle: 'Clasificaciones' }} />
    {query.isLoading ? <ScreenState kind="loading" /> : query.isError || !result ? <ScreenState kind="error" message="No fue posible consultar este resultado." /> : <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.resultCard}><View style={styles.resultIcon}><Ionicons color={severity ? severityColor[severity] : colors.textMuted} name="pulse" size={29} /></View><Text style={styles.eyebrow}>SEVERIDAD TABULAR</Text><Text style={[styles.severity, { color: severity ? severityColor[severity] : colors.textMuted }]}>{severity ?? 'Sin resultado'}</Text><Text style={styles.date}>{new Date(result.created_at).toLocaleString('es-MX')}</Text></View>
      <View style={styles.card}><Text style={styles.cardTitle}>Probabilidades del modelo</Text><Probability color={colors.success} label="Baja" value={result.prob_low} /><Probability color="#E9A23B" label="Media" value={result.prob_medium} /><Probability color={colors.danger} label="Alta" value={result.prob_high} /></View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Radiografía y fusión</Text>
        {imageSource && <Image accessibilityLabel="Radiografía" source={imageSource} style={styles.radiograph} />}
        {radiograph ? <><Text style={styles.meta}>Clase CNN: {radiograph.image_class}</Text><Text style={styles.meta}>Confianza: {Math.round(radiograph.confidence * 100)}%</Text>{integratedResult && <View style={styles.fusionBox}><Text style={styles.fusionLabel}>Resultado integrado</Text><Text style={styles.fusionValue}>{integratedResult.radiographic_support.replaceAll('_', ' ')}</Text><Text style={styles.fusionText}>{integratedResult.explanation}</Text><Text style={styles.meta}>Método: {integratedResult.fusion_method} · {integratedResult.fusion_version}</Text></View>}</> : <Text style={styles.emptyText}>Aún no hay una radiografía asociada a esta evaluación.</Text>}
        <Pressable accessibilityRole="button" disabled={isUploading || Boolean(radiograph)} onPress={selectAndUploadRadiograph} style={({ pressed }) => [styles.uploadButton, (pressed || isUploading || Boolean(radiograph)) && styles.buttonPressed]}><Ionicons color={colors.onPrimary} name="cloud-upload-outline" size={19} /><Text style={styles.uploadButtonText}>{isUploading ? 'Analizando…' : radiograph ? 'Radiografía ya cargada' : 'Seleccionar radiografía'}</Text></Pressable>
        {uploadError && <Text accessibilityRole="alert" style={styles.errorText}>{uploadError}</Text>}
      </View>
      <View style={styles.notice}><Ionicons color={colors.primaryDark} name="information-circle-outline" size={22} /><Text style={styles.noticeText}>Este resultado es un apoyo para la clasificación de severidad. La recomendación clínica permanecerá pendiente hasta validar sus reglas.</Text></View>
    </ScrollView>}
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safeArea: { backgroundColor: colors.background, flex: 1 }, container: { padding: 22, paddingBottom: 40 }, resultCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, padding: 26 }, resultIcon: { alignItems: 'center', backgroundColor: colors.primaryPale, borderRadius: 22, height: 62, justifyContent: 'center', width: 62 }, eyebrow: { color: colors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 17 }, severity: { fontSize: 34, fontWeight: '900', marginTop: 5 }, date: { color: colors.textSubtle, fontSize: 11, marginTop: 8 }, card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, marginTop: 16, padding: 19 }, cardTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 18 }, probability: { marginBottom: 17 }, probabilityHeader: { flexDirection: 'row', justifyContent: 'space-between' }, probabilityLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '700' }, probabilityValue: { color: colors.text, fontSize: 13, fontWeight: '800' }, track: { backgroundColor: colors.primaryPale, borderRadius: 6, height: 9, marginTop: 8, overflow: 'hidden' }, bar: { borderRadius: 6, height: 9 }, radiograph: { borderRadius: 14, height: 220, marginBottom: 14, width: '100%' }, meta: { color: colors.textMuted, fontSize: 12, marginTop: 5 }, fusionBox: { backgroundColor: colors.primaryPale, borderRadius: 12, marginTop: 14, padding: 13 }, fusionLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }, fusionValue: { color: colors.primaryDark, fontSize: 17, fontWeight: '800', marginTop: 5 }, fusionText: { color: colors.text, fontSize: 13, lineHeight: 19, marginTop: 7 }, emptyText: { color: colors.textMuted, fontSize: 13, lineHeight: 19 }, uploadButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 12, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 16, padding: 14 }, uploadButtonText: { color: colors.onPrimary, fontSize: 14, fontWeight: '800' }, buttonPressed: { opacity: 0.7 }, errorText: { color: colors.danger, fontSize: 12, lineHeight: 18, marginTop: 10 }, notice: { alignItems: 'flex-start', backgroundColor: colors.accentSoft, borderRadius: 17, flexDirection: 'row', gap: 11, marginTop: 16, padding: 16 }, noticeText: { color: colors.textMuted, flex: 1, fontSize: 12, lineHeight: 18 } });

import { useEffect, useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { materialsService } from '../services/materials';
import { purchasesService } from '../services/purchases';
import { colors } from '../theme';
import type { Material } from '../types/material';
import { formatCurrencyFromCents } from '../utils/currency';
import { calculatePreviewSubtotal } from '../utils/purchase';
import { parseKgToGrams } from '../utils/weight';

type Props = NativeStackScreenProps<RootStackParamList, 'NewPurchase'>;

export function NewPurchaseScreen({ navigation }: Props) {
  const [sellerName, setSellerName] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [validationError, setValidationError] = useState<string>();

  async function loadMaterials() {
    setLoading(true);
    setLoadError(undefined);
    try {
      setMaterials(await materialsService.list());
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught.message : 'Não foi possível carregar os materiais.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadMaterials(); }, []);

  const selectedItems = useMemo(() => materials.flatMap((material) => {
    const rawWeight = weights[material._id];
    if (!rawWeight?.trim()) return [];
    const weightInGrams = parseKgToGrams(rawWeight);
    if (!Number.isInteger(weightInGrams) || weightInGrams <= 0) return [];
    return [{
      material,
      weightInGrams,
      previewSubtotalInCents: calculatePreviewSubtotal(weightInGrams, material.pricePerKgInCents),
    }];
  }), [materials, weights]);

  const previewTotal = selectedItems.reduce((sum, item) => sum + item.previewSubtotalInCents, 0);

  function updateWeight(id: string, value: string) {
    setValidationError(undefined);
    setWeights((current) => ({ ...current, [id]: value }));
  }

  async function submit() {
    if (sellerName.trim().length < 2) {
      setValidationError('Informe o nome do vendedor ou fornecedor.');
      return;
    }
    const hasInvalidWeight = Object.values(weights).some((weight) => {
      if (!weight.trim()) return false;
      const grams = parseKgToGrams(weight);
      return !Number.isInteger(grams) || grams <= 0;
    });
    if (hasInvalidWeight) {
      setValidationError('Revise os pesos. Utilize valores maiores que zero, como 2,5.');
      return;
    }
    if (!selectedItems.length) {
      setValidationError('Informe o peso de pelo menos um material.');
      return;
    }

    setSubmitting(true);
    setValidationError(undefined);
    try {
      const purchase = await purchasesService.create({
        sellerName: sellerName.trim(),
        items: selectedItems.map(({ material, weightInGrams }) => ({ materialId: material._id, weightInGrams })),
      });
      navigation.replace('PurchaseReceipt', { purchase });
    } catch (caught) {
      Alert.alert('Não foi possível registrar', caught instanceof Error ? caught.message : 'Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.eyebrow}>NOVA OPERAÇÃO</Text>
          <Text style={styles.title}>Registre a pesagem</Text>
          <Text style={styles.subtitle}>Informe quem está vendendo e preencha somente os materiais presentes nesta compra.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Vendedor ou fornecedor</Text>
          <TextInput
            accessibilityLabel="Nome do vendedor ou fornecedor"
            autoCapitalize="words"
            maxLength={100}
            onChangeText={(value) => { setSellerName(value); setValidationError(undefined); }}
            placeholder="Ex.: João da Silva"
            placeholderTextColor="#93A098"
            style={styles.input}
            value={sellerName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Materiais e pesos</Text>
          <Text style={styles.hint}>Digite o peso em quilogramas. Deixe em branco o que não fizer parte da compra.</Text>

          {loading ? <ActivityIndicator color={colors.primary} size="large" style={styles.loader} /> : loadError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{loadError}</Text>
              <Pressable accessibilityRole="button" onPress={() => void loadMaterials()}><Text style={styles.retry}>Tentar novamente</Text></Pressable>
            </View>
          ) : !materials.length ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>Cadastre ao menos um material antes de registrar uma compra.</Text>
              <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Materials')}><Text style={styles.retry}>Abrir catálogo</Text></Pressable>
            </View>
          ) : materials.map((material) => {
            const weight = weights[material._id] ?? '';
            const grams = parseKgToGrams(weight);
            const subtotal = Number.isInteger(grams) && grams > 0
              ? calculatePreviewSubtotal(grams, material.pricePerKgInCents)
              : undefined;
            return (
              <View key={material._id} style={[styles.materialRow, subtotal !== undefined && styles.materialRowActive]}>
                <View style={styles.materialInfo}>
                  <Text style={styles.materialName}>{material.name}</Text>
                  <Text style={styles.materialPrice}>{formatCurrencyFromCents(material.pricePerKgInCents)} / kg</Text>
                  {subtotal !== undefined && <Text style={styles.subtotal}>Prévia: {formatCurrencyFromCents(subtotal)}</Text>}
                </View>
                <View style={styles.weightField}>
                  <TextInput
                    accessibilityLabel={`Peso de ${material.name} em quilogramas`}
                    keyboardType="decimal-pad"
                    onChangeText={(value) => updateWeight(material._id, value)}
                    placeholder="0,000"
                    placeholderTextColor="#93A098"
                    style={styles.weightInput}
                    value={weight}
                  />
                  <Text style={styles.kg}>kg</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>Prévia da compra</Text>
            <Text style={styles.summaryItems}>{selectedItems.length} {selectedItems.length === 1 ? 'material' : 'materiais'}</Text>
          </View>
          <Text style={styles.summaryTotal}>{formatCurrencyFromCents(previewTotal)}</Text>
        </View>
        <Text style={styles.disclaimer}>O valor oficial será recalculado pela API usando os preços vigentes ao confirmar.</Text>

        {validationError && <Text accessibilityRole="alert" style={styles.validation}>{validationError}</Text>}

        <Pressable
          accessibilityRole="button"
          disabled={loading || submitting || !!loadError || !materials.length}
          onPress={() => void submit()}
          style={({ pressed }) => [styles.submit, (pressed || submitting || loading || !!loadError || !materials.length) && styles.submitDisabled]}
        >
          <Text style={styles.submitText}>{submitting ? 'Registrando…' : 'Confirmar compra'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 44 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 6 },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 21, marginTop: 6 },
  section: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, marginTop: 20, padding: 18 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  hint: { color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 5, marginBottom: 14 },
  input: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, fontSize: 16, marginTop: 13, paddingHorizontal: 14, paddingVertical: 13 },
  loader: { marginVertical: 28 },
  materialRow: { alignItems: 'center', borderColor: colors.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginTop: 10, padding: 14 },
  materialRowActive: { backgroundColor: '#F6FAF5', borderColor: '#9FC6A8' },
  materialInfo: { flex: 1 },
  materialName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  materialPrice: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  subtotal: { color: colors.primary, fontSize: 12, fontWeight: '700', marginTop: 5 },
  weightField: { alignItems: 'center', borderColor: colors.border, borderRadius: 10, borderWidth: 1, flexDirection: 'row', paddingHorizontal: 10, width: 112 },
  weightInput: { color: colors.text, flex: 1, fontSize: 15, paddingVertical: 10, textAlign: 'right' },
  kg: { color: colors.textMuted, fontSize: 12, marginLeft: 5 },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: 12, marginTop: 14, padding: 14 },
  errorText: { color: colors.textMuted, lineHeight: 19 },
  retry: { color: colors.danger, fontWeight: '800', marginTop: 10 },
  summary: { alignItems: 'center', backgroundColor: colors.primaryDark, borderRadius: 18, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, padding: 18 },
  summaryLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  summaryItems: { color: '#BFD4C5', fontSize: 12, marginTop: 3 },
  summaryTotal: { color: '#FFFFFF', fontSize: 25, fontWeight: '800' },
  disclaimer: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 8, paddingHorizontal: 4 },
  validation: { color: colors.danger, fontSize: 13, fontWeight: '700', marginTop: 16 },
  submit: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, marginTop: 18, padding: 16 },
  submitDisabled: { opacity: 0.45 },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});

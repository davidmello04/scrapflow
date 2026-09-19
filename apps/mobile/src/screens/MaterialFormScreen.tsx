import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { materialsService } from '../services/materials';
import { colors } from '../theme';
import { parseCurrencyToCents } from '../utils/currency';

type Props = NativeStackScreenProps<RootStackParamList, 'MaterialForm'>;

export function MaterialFormScreen({ navigation, route }: Props) {
  const material = route.params?.material;
  const [name, setName] = useState(material?.name ?? '');
  const [price, setPrice] = useState(material ? (material.pricePerKgInCents / 100).toFixed(2).replace('.', ',') : '');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  async function submit() {
    const pricePerKgInCents = parseCurrencyToCents(price);
    const nextErrors = {
      name: name.trim().length < 2 ? 'Informe um nome com pelo menos 2 caracteres.' : undefined,
      price: !Number.isInteger(pricePerKgInCents) || pricePerKgInCents < 0 ? 'Informe um valor válido, como 3,50.' : undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.price) return;

    setSubmitting(true);
    try {
      const input = { name: name.trim(), pricePerKgInCents };
      material ? await materialsService.update(material._id, input) : await materialsService.create(input);
      navigation.goBack();
    } catch (caught) {
      Alert.alert('Não foi possível salvar', caught instanceof Error ? caught.message : 'Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.eyebrow}>{material ? 'ATUALIZAÇÃO' : 'NOVO CADASTRO'}</Text>
          <Text style={styles.title}>{material ? 'Edite o material' : 'Cadastre um material'}</Text>
          <Text style={styles.subtitle}>O preço informado será usado pela API para calcular novas compras.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Nome do material</Text>
            <TextInput
              accessibilityLabel="Nome do material"
              autoCapitalize="words"
              maxLength={80}
              onChangeText={setName}
              placeholder="Ex.: Alumínio"
              placeholderTextColor="#93A098"
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Preço pago por kg</Text>
            <View style={[styles.moneyInput, errors.price && styles.inputError]}>
              <Text style={styles.prefix}>R$</Text>
              <TextInput
                accessibilityLabel="Preço pago por quilograma"
                keyboardType="decimal-pad"
                onChangeText={setPrice}
                placeholder="0,00"
                placeholderTextColor="#93A098"
                style={styles.moneyText}
                value={price}
              />
            </View>
            {errors.price && <Text style={styles.error}>{errors.price}</Text>}
          </View>

          <Pressable accessibilityRole="button" disabled={submitting} onPress={() => void submit()} style={({ pressed }) => [styles.submit, (pressed || submitting) && styles.submitPressed]}>
            <Text style={styles.submitText}>{submitting ? 'Salvando…' : material ? 'Salvar alterações' : 'Cadastrar material'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 22 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 6 },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 21, marginTop: 6 },
  form: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, gap: 20, marginTop: 28, padding: 20 },
  field: { gap: 7 },
  label: { color: colors.text, fontSize: 14, fontWeight: '700' },
  input: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, fontSize: 16, paddingHorizontal: 14, paddingVertical: 13 },
  inputError: { borderColor: colors.danger },
  moneyInput: { alignItems: 'center', borderColor: colors.border, borderRadius: 12, borderWidth: 1, flexDirection: 'row', paddingHorizontal: 14 },
  prefix: { color: colors.textMuted, fontSize: 16, fontWeight: '600', marginRight: 8 },
  moneyText: { color: colors.text, flex: 1, fontSize: 16, paddingVertical: 13 },
  error: { color: colors.danger, fontSize: 12 },
  submit: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 13, marginTop: 4, padding: 15 },
  submitPressed: { opacity: 0.7 },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

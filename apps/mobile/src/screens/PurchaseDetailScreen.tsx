import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PurchaseDetailsCard } from '../components/PurchaseDetailsCard';
import { ReceiptActions } from '../components/ReceiptActions';
import type { RootStackParamList } from '../navigation/types';
import { purchasesService } from '../services/purchases';
import { colors } from '../theme';
import type { Purchase } from '../types/purchase';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseDetail'>;

export function PurchaseDetailScreen({ route }: Props) {
  const [purchase, setPurchase] = useState<Purchase>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  async function load() {
    setLoading(true);
    setError(undefined);
    try {
      setPurchase(await purchasesService.get(route.params.purchaseId));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível carregar a compra.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [route.params.purchaseId]);

  if (loading) return <ActivityIndicator color={colors.primary} size="large" style={styles.loader} />;
  if (error || !purchase) return (
    <View style={styles.errorBox}>
      <Text style={styles.errorTitle}>Falha ao carregar</Text>
      <Text style={styles.errorText}>{error ?? 'Compra não encontrada.'}</Text>
      <Pressable accessibilityRole="button" onPress={() => void load()}><Text style={styles.retry}>Tentar novamente</Text></Pressable>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>REGISTRO PERSISTIDO</Text>
      <Text style={styles.title}>Detalhes da compra</Text>
      <Text style={styles.subtitle}>Valores e preços registrados no momento da operação.</Text>
      <View style={styles.cardWrapper}><PurchaseDetailsCard purchase={purchase} /></View>
      <ReceiptActions purchase={purchase} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 6 },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: 5 },
  cardWrapper: { marginTop: 20 },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: 16, margin: 20, padding: 18 },
  errorTitle: { color: colors.danger, fontSize: 17, fontWeight: '800' },
  errorText: { color: colors.textMuted, marginTop: 5 },
  retry: { color: colors.danger, fontWeight: '800', marginTop: 12 },
});

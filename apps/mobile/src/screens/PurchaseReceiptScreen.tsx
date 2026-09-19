import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { formatCurrencyFromCents } from '../utils/currency';
import { formatWeightFromGrams } from '../utils/weight';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseReceipt'>;

export function PurchaseReceiptScreen({ navigation, route }: Props) {
  const { purchase } = route.params;
  const shortId = purchase._id.slice(-8).toUpperCase();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.success}>
        <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
        <Text style={styles.eyebrow}>COMPRA REGISTRADA</Text>
        <Text style={styles.title}>{formatCurrencyFromCents(purchase.totalInCents)}</Text>
        <Text style={styles.subtitle}>Total oficial calculado e armazenado pela API.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.metaRow}>
          <View><Text style={styles.metaLabel}>Vendedor</Text><Text style={styles.metaValue}>{purchase.sellerName}</Text></View>
          <View style={styles.metaRight}><Text style={styles.metaLabel}>Código</Text><Text style={styles.metaValue}>#{shortId}</Text></View>
        </View>

        <View style={styles.divider} />
        <Text style={styles.itemsTitle}>Itens da compra</Text>
        {purchase.items.map((item, index) => (
          <View key={`${item.materialId}-${index}`} style={styles.item}>
            <View style={styles.itemMain}>
              <Text style={styles.itemName}>{item.materialName}</Text>
              <Text style={styles.itemDetail}>{formatWeightFromGrams(item.weightInGrams)} × {formatCurrencyFromCents(item.pricePerKgInCents)}/kg</Text>
            </View>
            <Text style={styles.itemSubtotal}>{formatCurrencyFromCents(item.subtotalInCents)}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrencyFromCents(purchase.totalInCents)}</Text>
        </View>
      </View>

      <Pressable accessibilityRole="button" onPress={() => navigation.replace('NewPurchase')} style={styles.primaryButton}>
        <Text style={styles.primaryText}>Registrar outra compra</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} style={styles.secondaryButton}>
        <Text style={styles.secondaryText}>Voltar ao início</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 44 },
  success: { alignItems: 'center', paddingVertical: 22 },
  check: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 999, height: 58, justifyContent: 'center', width: 58 },
  checkText: { color: colors.primary, fontSize: 30, fontWeight: '800' },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginTop: 14 },
  title: { color: colors.text, fontSize: 36, fontWeight: '800', marginTop: 7 },
  subtitle: { color: colors.textMuted, fontSize: 13, marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, padding: 18 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaRight: { alignItems: 'flex-end' },
  metaLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  metaValue: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 4 },
  divider: { backgroundColor: colors.border, height: 1, marginVertical: 18 },
  itemsTitle: { color: colors.text, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  item: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13 },
  itemMain: { flex: 1, paddingRight: 12 },
  itemName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  itemDetail: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  itemSubtotal: { color: colors.text, fontSize: 14, fontWeight: '800' },
  totalRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 18 },
  totalLabel: { color: colors.text, fontSize: 17, fontWeight: '800' },
  totalValue: { color: colors.primary, fontSize: 24, fontWeight: '800' },
  primaryButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, marginTop: 20, padding: 16 },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  secondaryButton: { alignItems: 'center', padding: 15 },
  secondaryText: { color: colors.primary, fontSize: 14, fontWeight: '800' },
});

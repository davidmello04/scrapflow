import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import type { Purchase } from '../types/purchase';
import { formatCurrencyFromCents } from '../utils/currency';
import { formatDateTime } from '../utils/date';
import { formatWeightFromGrams } from '../utils/weight';

type Props = { purchase: Purchase };

export function PurchaseDetailsCard({ purchase }: Props) {
  const shortId = purchase._id.slice(-8).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.metaRow}>
        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>Vendedor</Text>
          <Text style={styles.metaValue}>{purchase.sellerName}</Text>
        </View>
        <View style={styles.metaRight}>
          <Text style={styles.metaLabel}>Código</Text>
          <Text style={styles.metaValue}>#{shortId}</Text>
        </View>
      </View>
      <Text style={styles.date}>{formatDateTime(purchase.createdAt)}</Text>

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
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, padding: 18 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaBlock: { flex: 1, paddingRight: 12 },
  metaRight: { alignItems: 'flex-end' },
  metaLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  metaValue: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 4 },
  date: { color: colors.textMuted, fontSize: 12, marginTop: 8 },
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
});

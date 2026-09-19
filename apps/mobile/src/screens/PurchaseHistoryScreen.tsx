import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import type { RootStackParamList } from '../navigation/types';
import { purchasesService } from '../services/purchases';
import { colors } from '../theme';
import type { Purchase } from '../types/purchase';
import { formatCurrencyFromCents } from '../utils/currency';
import { formatDateTime } from '../utils/date';
import { formatWeightFromGrams } from '../utils/weight';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseHistory'>;
type Period = 'all' | 7 | 30;
const periods: Array<{ value: Period; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 7, label: '7 dias' },
  { value: 30, label: '30 dias' },
];

export function PurchaseHistoryScreen({ navigation }: Props) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [period, setPeriod] = useState<Period>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();

  const load = useCallback(async (isRefresh = false, nextSearch = appliedSearch, nextPeriod = period) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(undefined);
    try {
      setPurchases(await purchasesService.list({
        search: nextSearch || undefined,
        days: nextPeriod === 'all' ? undefined : nextPeriod,
      }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [appliedSearch, period]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  function applySearch() {
    const next = search.trim();
    setAppliedSearch(next);
    void load(false, next, period);
  }

  function changePeriod(next: Period) {
    setPeriod(next);
    void load(false, appliedSearch, next);
  }

  function clearFilters() {
    setSearch('');
    setAppliedSearch('');
    setPeriod('all');
    void load(false, '', 'all');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.filters}>
        <TextInput
          accessibilityLabel="Buscar pelo nome do vendedor"
          onChangeText={setSearch}
          onSubmitEditing={applySearch}
          placeholder="Buscar vendedor"
          placeholderTextColor="#93A098"
          returnKeyType="search"
          style={styles.searchInput}
          value={search}
        />
        <Pressable accessibilityRole="button" onPress={applySearch} style={styles.searchButton}><Text style={styles.searchButtonText}>Buscar</Text></Pressable>
        <View style={styles.periods}>
          {periods.map((option) => (
            <Pressable
              accessibilityRole="button"
              key={option.value}
              onPress={() => changePeriod(option.value)}
              style={[styles.chip, period === option.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, period === option.value && styles.chipTextActive]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {loading ? <ActivityIndicator color={colors.primary} size="large" style={styles.loader} /> : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Falha ao carregar</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void load()}><Text style={styles.retry}>Tentar novamente</Text></Pressable>
        </View>
      ) : (
        <FlatList
          data={purchases}
          keyExtractor={(item) => item._id}
          contentContainerStyle={purchases.length ? styles.list : styles.emptyList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={colors.primary} />}
          ListEmptyComponent={(
            <View>
              <EmptyState title="Nenhuma compra encontrada" description="Não há operações que correspondam aos filtros selecionados." />
              {(appliedSearch || period !== 'all') && <Pressable accessibilityRole="button" onPress={clearFilters} style={styles.clearButton}><Text style={styles.clearText}>Limpar filtros</Text></Pressable>}
            </View>
          )}
          renderItem={({ item }) => {
            const totalWeight = item.items.reduce((sum, current) => sum + current.weightInGrams, 0);
            return (
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('PurchaseDetail', { purchaseId: item._id })}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardMain}>
                    <Text style={styles.seller}>{item.sellerName}</Text>
                    <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.total}>{formatCurrencyFromCents(item.totalInCents)}</Text>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.meta}>{item.items.length} {item.items.length === 1 ? 'item' : 'itens'} · {formatWeightFromGrams(totalWeight)}</Text>
                  <Text style={styles.open}>Ver detalhes →</Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  filters: { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 9, padding: 14 },
  searchInput: { borderColor: colors.border, borderRadius: 11, borderWidth: 1, color: colors.text, flex: 1, fontSize: 14, minWidth: 190, paddingHorizontal: 13, paddingVertical: 11 },
  searchButton: { backgroundColor: colors.primary, borderRadius: 11, justifyContent: 'center', paddingHorizontal: 16 },
  searchButtonText: { color: '#FFFFFF', fontWeight: '800' },
  periods: { flexBasis: '100%', flexDirection: 'row', gap: 8 },
  chip: { borderColor: colors.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: '#9FC6A8' },
  chipText: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: colors.primaryDark },
  loader: { flex: 1 },
  list: { gap: 12, padding: 16, paddingBottom: 36 },
  emptyList: { flexGrow: 1, justifyContent: 'center', paddingBottom: 40 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, padding: 16 },
  cardPressed: { opacity: 0.7 },
  cardTop: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  cardMain: { flex: 1, paddingRight: 12 },
  seller: { color: colors.text, fontSize: 16, fontWeight: '800' },
  date: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  total: { color: colors.primary, fontSize: 19, fontWeight: '800' },
  cardBottom: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 12 },
  meta: { color: colors.textMuted, fontSize: 12 },
  open: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: 16, margin: 20, padding: 18 },
  errorTitle: { color: colors.danger, fontSize: 17, fontWeight: '800' },
  errorText: { color: colors.textMuted, marginTop: 5 },
  retry: { color: colors.danger, fontWeight: '800', marginTop: 12 },
  clearButton: { alignSelf: 'center', padding: 12 },
  clearText: { color: colors.primary, fontWeight: '800' },
});

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import type { RootStackParamList } from '../navigation/types';
import { materialsService } from '../services/materials';
import { colors } from '../theme';
import type { Material } from '../types/material';
import { formatCurrencyFromCents } from '../utils/currency';

type Props = NativeStackScreenProps<RootStackParamList, 'Materials'>;

export function MaterialsScreen({ navigation }: Props) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(undefined);
    try {
      setMaterials(await materialsService.list());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível carregar os materiais.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  function confirmDeactivate(material: Material) {
    Alert.alert(
      'Desativar material?',
      `${material.name} deixará de aparecer em novas compras. O histórico será preservado.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desativar', style: 'destructive', onPress: async () => {
            try {
              await materialsService.deactivate(material._id);
              await load();
            } catch (caught) {
              Alert.alert('Não foi possível desativar', caught instanceof Error ? caught.message : 'Tente novamente.');
            }
          },
        },
      ],
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>CATÁLOGO DE COMPRA</Text>
        <Text style={styles.title}>Preços por material</Text>
        <Text style={styles.subtitle}>Mantenha os valores por quilograma atualizados antes de registrar uma compra.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Falha ao carregar</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void load()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={materials}
          keyExtractor={(item) => item._id}
          contentContainerStyle={materials.length ? styles.list : styles.emptyList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={colors.primary} />}
          ListEmptyComponent={<EmptyState title="Nenhum material cadastrado" description="Cadastre o primeiro material e informe o valor pago por quilograma." />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardMain}>
                <Text style={styles.materialName}>{item.name}</Text>
                <Text style={styles.price}>{formatCurrencyFromCents(item.pricePerKgInCents)}<Text style={styles.unit}> / kg</Text></Text>
              </View>
              <View style={styles.actions}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Editar ${item.name}`} onPress={() => navigation.navigate('MaterialForm', { material: item })} style={styles.secondaryButton}>
                  <Text style={styles.secondaryText}>Editar</Text>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={`Desativar ${item.name}`} onPress={() => confirmDeactivate(item)} style={styles.dangerButton}>
                  <Text style={styles.dangerText}>Desativar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      <Pressable accessibilityRole="button" accessibilityLabel="Cadastrar novo material" onPress={() => navigation.navigate('MaterialForm')} style={styles.fab}>
        <Text style={styles.fabPlus}>＋</Text>
        <Text style={styles.fabText}>Novo material</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  intro: { paddingHorizontal: 20, paddingBottom: 10, paddingTop: 18 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 6 },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 21, marginTop: 6 },
  loader: { flex: 1 },
  list: { gap: 12, padding: 20, paddingBottom: 110 },
  emptyList: { flexGrow: 1, justifyContent: 'center', paddingBottom: 90 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, padding: 17 },
  cardMain: { gap: 5 },
  materialName: { color: colors.text, fontSize: 18, fontWeight: '700' },
  price: { color: colors.primary, fontSize: 22, fontWeight: '800' },
  unit: { color: colors.textMuted, fontSize: 13, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  secondaryButton: { backgroundColor: colors.primarySoft, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10 },
  secondaryText: { color: colors.primaryDark, fontWeight: '700' },
  dangerButton: { borderColor: '#E7C6C1', borderRadius: 10, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 10 },
  dangerText: { color: colors.danger, fontWeight: '700' },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: 16, margin: 20, padding: 18 },
  errorTitle: { color: colors.danger, fontSize: 17, fontWeight: '700' },
  errorText: { color: colors.textMuted, lineHeight: 20, marginTop: 4 },
  retryButton: { alignSelf: 'flex-start', marginTop: 14 },
  retryText: { color: colors.danger, fontWeight: '700' },
  fab: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 16, bottom: 24, elevation: 4, flexDirection: 'row', gap: 6, paddingHorizontal: 18, paddingVertical: 14, position: 'absolute', right: 20 },
  fabPlus: { color: '#FFFFFF', fontSize: 20, lineHeight: 20 },
  fabText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});

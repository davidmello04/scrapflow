import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { usersService } from '../services/users';
import { colors } from '../theme';
import type { ManagedUser, UserRole } from '../types/user';

type Props = NativeStackScreenProps<RootStackParamList, 'Users'>;

export function UsersScreen({ navigation }: Props) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError(undefined);
    try { setUsers(await usersService.list()); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Não foi possível carregar os usuários.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  function confirmUpdate(target: ManagedUser, change: { role?: UserRole; active?: boolean }) {
    const action = change.active === false ? 'desativar' : change.active === true ? 'reativar' : change.role === 'ADMIN' ? 'promover' : 'alterar para operador';
    Alert.alert(`${action.charAt(0).toUpperCase() + action.slice(1)} usuário?`, `A alteração será aplicada a ${target.name}.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', style: change.active === false ? 'destructive' : 'default', onPress: async () => {
        try { await usersService.update(target.id, change); await load(); }
        catch (caught) { Alert.alert('Alteração não realizada', caught instanceof Error ? caught.message : 'Tente novamente.'); }
      } },
    ]);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.intro}>
        <View style={styles.introText}><Text style={styles.title}>Contas de acesso</Text><Text style={styles.subtitle}>Gerencie papéis sem excluir o histórico das contas.</Text></View>
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('NewUser')} style={styles.addButton}><Text style={styles.addText}>＋ Novo</Text></Pressable>
      </View>
      {loading ? <ActivityIndicator color={colors.primary} size="large" style={styles.loader} /> : error ? (
        <View style={styles.errorBox}><Text style={styles.errorTitle}>Falha ao carregar</Text><Text style={styles.errorText}>{error}</Text><Pressable onPress={() => void load()}><Text style={styles.retry}>Tentar novamente</Text></Pressable></View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={colors.primary} />}
          renderItem={({ item }) => {
            const isSelf = item.id === currentUser?.id;
            return (
              <View style={[styles.card, !item.active && styles.cardInactive]}>
                <View style={styles.cardTop}><View style={styles.userMain}><Text style={styles.name}>{item.name}{isSelf ? ' (você)' : ''}</Text><Text style={styles.email}>{item.email}</Text></View><Text style={[styles.status, item.active ? styles.statusActive : styles.statusInactive]}>{item.active ? 'Ativo' : 'Inativo'}</Text></View>
                <Text style={styles.role}>{item.role === 'ADMIN' ? 'Administrador' : 'Operador'}</Text>
                <View style={styles.actions}>
                  <Pressable accessibilityRole="button" disabled={isSelf} onPress={() => navigation.navigate('ResetUserPassword', { userId: item.id, userName: item.name })} style={[styles.secondaryButton, isSelf && styles.disabled]}><Text style={styles.secondaryText}>Redefinir senha</Text></Pressable>
                  <Pressable accessibilityRole="button" disabled={isSelf} onPress={() => confirmUpdate(item, { role: item.role === 'ADMIN' ? 'OPERATOR' : 'ADMIN' })} style={[styles.secondaryButton, isSelf && styles.disabled]}><Text style={styles.secondaryText}>{item.role === 'ADMIN' ? 'Tornar operador' : 'Promover a admin'}</Text></Pressable>
                  <Pressable accessibilityRole="button" disabled={isSelf} onPress={() => confirmUpdate(item, { active: !item.active })} style={[styles.accessButton, isSelf && styles.disabled]}><Text style={item.active ? styles.deactivateText : styles.activateText}>{item.active ? 'Desativar' : 'Reativar'}</Text></Pressable>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  intro: { alignItems: 'center', backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', padding: 18 },
  introText: { flex: 1 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  addButton: { backgroundColor: colors.primary, borderRadius: 11, paddingHorizontal: 14, paddingVertical: 11 },
  addText: { color: '#FFFFFF', fontWeight: '800' },
  loader: { flex: 1 },
  list: { gap: 12, padding: 16, paddingBottom: 36 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, padding: 16 },
  cardInactive: { opacity: 0.65 },
  cardTop: { alignItems: 'flex-start', flexDirection: 'row' },
  userMain: { flex: 1, paddingRight: 10 },
  name: { color: colors.text, fontSize: 16, fontWeight: '800' },
  email: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  status: { borderRadius: 999, fontSize: 11, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5 },
  statusActive: { backgroundColor: colors.primarySoft, color: colors.primary },
  statusInactive: { backgroundColor: colors.dangerSoft, color: colors.danger },
  role: { color: colors.primary, fontSize: 12, fontWeight: '800', marginTop: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  secondaryButton: { backgroundColor: colors.primarySoft, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  secondaryText: { color: colors.primaryDark, fontSize: 12, fontWeight: '800' },
  accessButton: { borderColor: colors.border, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
  deactivateText: { color: colors.danger, fontSize: 12, fontWeight: '800' },
  activateText: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  disabled: { opacity: 0.35 },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: 16, margin: 20, padding: 18 },
  errorTitle: { color: colors.danger, fontSize: 17, fontWeight: '800' },
  errorText: { color: colors.textMuted, marginTop: 5 },
  retry: { color: colors.danger, fontWeight: '800', marginTop: 12 },
});

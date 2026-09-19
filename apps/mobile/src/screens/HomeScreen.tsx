import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { useAuth } from '../auth/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const actions = [
  {
    title: 'Usuários e acessos',
    description: 'Crie operadores e administre papéis e acessos ativos.',
    badge: 'ADMINISTRAÇÃO',
    route: 'Users' as const,
  },
  {
    title: 'Registrar compra',
    description: 'Selecione os materiais, informe os pesos e confirme o valor calculado.',
    badge: 'FLUXO PRINCIPAL',
    route: 'NewPurchase' as const,
  },
  {
    title: 'Histórico de compras',
    description: 'Consulte operações anteriores, pesquise vendedores e confira os valores persistidos.',
    badge: 'HISTÓRICO',
    route: 'PurchaseHistory' as const,
  },
  {
    title: 'Materiais e preços',
    description: 'Cadastre materiais e mantenha atualizado o valor pago por quilograma.',
    badge: 'CATÁLOGO',
    route: 'Materials' as const,
  },
];

export function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const visibleActions = actions.filter((action) => !['Materials', 'Users'].includes(action.route) || user?.role === 'ADMIN');
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>GESTÃO DE RECICLÁVEIS</Text>
        <Text style={styles.title}>Operação simples, valores confiáveis.</Text>
        <Text style={styles.subtitle}>Organize pesagens e compras enquanto a API preserva as regras e os totais oficiais.</Text>
      </View>

      <View style={styles.grid}>
        {visibleActions.map((action) => (
          <Pressable
            accessibilityRole="button"
            key={action.route}
            onPress={() => navigation.navigate(action.route)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <Text style={styles.badge}>{action.badge}</Text>
            <Text style={styles.cardTitle}>{action.title}</Text>
            <Text style={styles.cardDescription}>{action.description}</Text>
            <Text style={styles.link}>Acessar  →</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.session}>
        <View><Text style={styles.sessionName}>{user?.name}</Text><Text style={styles.sessionRole}>{user?.role === 'ADMIN' ? 'Administrador' : 'Operador'}</Text></View>
        <View style={styles.sessionActions}>
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('ChangePassword')}><Text style={styles.password}>Alterar senha</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => void logout()}><Text style={styles.logout}>Sair</Text></Pressable>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Como o cálculo funciona</Text>
        <Text style={styles.infoText}>A prévia ajuda na conferência. Ao salvar, a API consulta os preços vigentes e recalcula todos os itens.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  hero: { backgroundColor: colors.primaryDark, borderRadius: 24, padding: 24 },
  eyebrow: { color: '#A9CFB3', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', lineHeight: 36, marginTop: 10 },
  subtitle: { color: '#D9E6DD', fontSize: 15, lineHeight: 22, marginTop: 10 },
  grid: { gap: 14, marginTop: 18 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, padding: 20 },
  cardPressed: { opacity: 0.7 },
  badge: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  cardTitle: { color: colors.text, fontSize: 21, fontWeight: '800', marginTop: 8 },
  cardDescription: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 6 },
  link: { color: colors.primary, fontSize: 14, fontWeight: '800', marginTop: 18 },
  info: { backgroundColor: colors.primarySoft, borderRadius: 16, marginTop: 18, padding: 18 },
  infoTitle: { color: colors.primaryDark, fontSize: 15, fontWeight: '800' },
  infoText: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  session: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, paddingTop: 18 },
  sessionName: { color: colors.text, fontSize: 14, fontWeight: '800' },
  sessionRole: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  logout: { color: colors.danger, fontSize: 14, fontWeight: '800', padding: 8 },
  password: { color: colors.primary, fontSize: 13, fontWeight: '800', padding: 8 },
  sessionActions: { alignItems: 'center', flexDirection: 'row', gap: 2 },
});

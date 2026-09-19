import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { usersService } from '../services/users';
import { colors } from '../theme';
import type { UserRole } from '../types/user';

type Props = NativeStackScreenProps<RootStackParamList, 'NewUser'>;

export function NewUserScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('OPERATOR');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  async function submit() {
    if (name.trim().length < 2) return setError('Informe um nome com pelo menos 2 caracteres.');
    if (!email.includes('@')) return setError('Informe um e-mail válido.');
    if (password.length < 10) return setError('A senha deve ter pelo menos 10 caracteres.');

    setSubmitting(true);
    setError(undefined);
    try {
      await usersService.create({ name: name.trim(), email: email.trim().toLowerCase(), password, role });
      navigation.goBack();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível criar a conta.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>ACESSO CONTROLADO</Text>
        <Text style={styles.title}>Criar usuário</Text>
        <Text style={styles.subtitle}>A conta será criada ativa. Não compartilhe senhas por canais públicos.</Text>
        <View style={styles.form}>
          <TextInput accessibilityLabel="Nome" autoCapitalize="words" onChangeText={setName} placeholder="Nome completo" placeholderTextColor="#93A098" style={styles.input} value={name} />
          <TextInput accessibilityLabel="E-mail" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" onChangeText={setEmail} placeholder="E-mail" placeholderTextColor="#93A098" style={styles.input} value={email} />
          <TextInput accessibilityLabel="Senha inicial" onChangeText={setPassword} placeholder="Senha inicial (mín. 10 caracteres)" placeholderTextColor="#93A098" secureTextEntry style={styles.input} value={password} />
          <Text style={styles.label}>Papel de acesso</Text>
          <View style={styles.roles}>
            {(['OPERATOR', 'ADMIN'] as UserRole[]).map((option) => (
              <Pressable accessibilityRole="button" key={option} onPress={() => setRole(option)} style={[styles.roleButton, role === option && styles.roleActive]}>
                <Text style={[styles.roleText, role === option && styles.roleTextActive]}>{option === 'ADMIN' ? 'Administrador' : 'Operador'}</Text>
              </Pressable>
            ))}
          </View>
          {role === 'ADMIN' && <Text style={styles.warning}>Administradores podem gerenciar materiais e contas de acesso.</Text>}
          {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Pressable accessibilityRole="button" disabled={submitting} onPress={() => void submit()} style={({ pressed }) => [styles.submit, (pressed || submitting) && styles.disabled]}>
            <Text style={styles.submitText}>{submitting ? 'Criando…' : 'Criar conta'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 6 },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 5 },
  form: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, gap: 12, marginTop: 22, padding: 18 },
  input: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, fontSize: 15, paddingHorizontal: 14, paddingVertical: 13 },
  label: { color: colors.text, fontSize: 13, fontWeight: '800', marginTop: 4 },
  roles: { flexDirection: 'row', gap: 10 },
  roleButton: { alignItems: 'center', borderColor: colors.border, borderRadius: 11, borderWidth: 1, flex: 1, padding: 12 },
  roleActive: { backgroundColor: colors.primarySoft, borderColor: '#9FC6A8' },
  roleText: { color: colors.textMuted, fontWeight: '700' },
  roleTextActive: { color: colors.primaryDark },
  warning: { backgroundColor: '#FFF4DC', borderRadius: 10, color: '#755418', fontSize: 12, lineHeight: 17, padding: 11 },
  error: { color: colors.danger, fontSize: 13, fontWeight: '700' },
  submit: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 13, marginTop: 4, padding: 15 },
  disabled: { opacity: 0.55 },
  submitText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});

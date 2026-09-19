import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  async function submit() {
    if (!email.trim() || !password) {
      setError('Informe o e-mail e a senha.');
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>GESTÃO DE RECICLÁVEIS</Text>
        <Text style={styles.brand}>ScrapFlow</Text>
        <Text style={styles.subtitle}>Entre com sua conta para acessar a operação.</Text>
        <TextInput accessibilityLabel="E-mail" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" onChangeText={setEmail} placeholder="E-mail" placeholderTextColor="#93A098" style={styles.input} value={email} />
        <TextInput accessibilityLabel="Senha" onChangeText={setPassword} onSubmitEditing={() => void submit()} placeholder="Senha" placeholderTextColor="#93A098" secureTextEntry style={styles.input} value={password} />
        {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <Pressable accessibilityRole="button" disabled={submitting} onPress={() => void submit()} style={({ pressed }) => [styles.button, (pressed || submitting) && styles.buttonPressed]}>
          <Text style={styles.buttonText}>{submitting ? 'Entrando…' : 'Entrar'}</Text>
        </Pressable>
        <Text style={styles.note}>Não há cadastro público. Contas são provisionadas por um administrador.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: 22 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, padding: 24 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  brand: { color: colors.text, fontSize: 36, fontWeight: '800', marginTop: 7 },
  subtitle: { color: colors.textMuted, fontSize: 15, marginBottom: 24, marginTop: 6 },
  input: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, fontSize: 16, marginTop: 12, paddingHorizontal: 14, paddingVertical: 13 },
  error: { color: colors.danger, fontSize: 13, fontWeight: '700', marginTop: 13 },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 13, marginTop: 18, padding: 15 },
  buttonPressed: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  note: { color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 16, textAlign: 'center' },
});

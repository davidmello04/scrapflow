import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { useAuth } from '../auth/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

export function ChangePasswordScreen({ navigation }: Props) {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  async function submit() {
    if (!currentPassword) return setError('Informe sua senha atual.');
    if (newPassword.length < 10) return setError('A nova senha deve ter pelo menos 10 caracteres.');
    if (newPassword !== confirmation) return setError('A confirmação não corresponde à nova senha.');
    if (newPassword === currentPassword) return setError('A nova senha deve ser diferente da senha atual.');

    setSubmitting(true);
    setError(undefined);
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert('Senha alterada', 'Sua nova senha já está ativa. Entre novamente para continuar.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível alterar a senha.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>SEGURANÇA DA CONTA</Text>
        <Text style={styles.title}>Alterar minha senha</Text>
        <Text style={styles.subtitle}>Confirme sua senha atual e escolha uma nova senha com pelo menos 10 caracteres.</Text>
        <View style={styles.form}>
          <TextInput accessibilityLabel="Senha atual" onChangeText={setCurrentPassword} placeholder="Senha atual" placeholderTextColor="#93A098" secureTextEntry style={styles.input} value={currentPassword} />
          <TextInput accessibilityLabel="Nova senha" onChangeText={setNewPassword} placeholder="Nova senha" placeholderTextColor="#93A098" secureTextEntry style={styles.input} value={newPassword} />
          <TextInput accessibilityLabel="Confirmar nova senha" onChangeText={setConfirmation} placeholder="Confirme a nova senha" placeholderTextColor="#93A098" secureTextEntry style={styles.input} value={confirmation} />
          {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Pressable accessibilityRole="button" disabled={submitting} onPress={() => void submit()} style={({ pressed }) => [styles.submit, (pressed || submitting) && styles.disabled]}>
            <Text style={styles.submitText}>{submitting ? 'Alterando…' : 'Alterar senha'}</Text>
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
  error: { color: colors.danger, fontSize: 13, fontWeight: '700' },
  submit: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 13, marginTop: 4, padding: 15 },
  disabled: { opacity: 0.55 },
  submitText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});

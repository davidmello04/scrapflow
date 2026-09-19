import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { usersService } from '../services/users';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetUserPassword'>;

export function ResetUserPasswordScreen({ navigation, route }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  async function submit() {
    if (newPassword.length < 10) return setError('A nova senha deve ter pelo menos 10 caracteres.');
    if (newPassword !== confirmation) return setError('A confirmação não corresponde à nova senha.');

    setSubmitting(true);
    setError(undefined);
    try {
      await usersService.resetPassword(route.params.userId, newPassword);
      Alert.alert('Senha redefinida', `A nova senha de ${route.params.userName} já está ativa. Compartilhe-a por um canal seguro.`, [{ text: 'Concluir', onPress: () => navigation.goBack() }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível redefinir a senha.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>REDEFINIÇÃO ADMINISTRATIVA</Text>
        <Text style={styles.title}>Nova senha</Text>
        <Text style={styles.subtitle}>Defina uma nova senha para {route.params.userName}. A senha anterior deixará de funcionar imediatamente.</Text>
        <View style={styles.warning}><Text style={styles.warningText}>Não envie senhas em grupos, comentários ou outros canais públicos.</Text></View>
        <View style={styles.form}>
          <TextInput accessibilityLabel="Nova senha" onChangeText={setNewPassword} placeholder="Nova senha (mín. 10 caracteres)" placeholderTextColor="#93A098" secureTextEntry style={styles.input} value={newPassword} />
          <TextInput accessibilityLabel="Confirmar nova senha" onChangeText={setConfirmation} placeholder="Confirme a nova senha" placeholderTextColor="#93A098" secureTextEntry style={styles.input} value={confirmation} />
          {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Pressable accessibilityRole="button" disabled={submitting} onPress={() => void submit()} style={({ pressed }) => [styles.submit, (pressed || submitting) && styles.disabled]}>
            <Text style={styles.submitText}>{submitting ? 'Redefinindo…' : 'Redefinir senha'}</Text>
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
  warning: { backgroundColor: '#FFF4DC', borderRadius: 12, marginTop: 18, padding: 13 },
  warningText: { color: '#755418', fontSize: 12, lineHeight: 18 },
  form: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, gap: 12, marginTop: 14, padding: 18 },
  input: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, fontSize: 15, paddingHorizontal: 14, paddingVertical: 13 },
  error: { color: colors.danger, fontSize: 13, fontWeight: '700' },
  submit: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 13, marginTop: 4, padding: 15 },
  disabled: { opacity: 0.55 },
  submitText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});

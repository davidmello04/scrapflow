import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { printReceipt, shareReceiptPdf } from '../services/receipt';
import { colors } from '../theme';
import type { Purchase } from '../types/purchase';

type Props = { purchase: Purchase };
type Action = 'share' | 'print';

export function ReceiptActions({ purchase }: Props) {
  const [action, setAction] = useState<Action>();

  async function run(nextAction: Action) {
    setAction(nextAction);
    try {
      nextAction === 'share' ? await shareReceiptPdf(purchase) : await printReceipt(purchase);
    } catch (caught) {
      Alert.alert('Não foi possível gerar o comprovante', caught instanceof Error ? caught.message : 'Tente novamente.');
    } finally {
      setAction(undefined);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        disabled={!!action}
        onPress={() => void run('share')}
        style={({ pressed }) => [styles.primary, (pressed || !!action) && styles.pressed]}
      >
        <Text style={styles.primaryText}>{action === 'share' ? 'Gerando PDF…' : 'Compartilhar PDF'}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        disabled={!!action}
        onPress={() => void run('print')}
        style={({ pressed }) => [styles.secondary, (pressed || !!action) && styles.pressed]}
      >
        <Text style={styles.secondaryText}>{action === 'print' ? 'Abrindo impressão…' : 'Imprimir comprovante'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10, marginTop: 18 },
  primary: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, padding: 15 },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  secondary: { alignItems: 'center', borderColor: colors.primary, borderRadius: 14, borderWidth: 1, padding: 14 },
  secondaryText: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.55 },
});

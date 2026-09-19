import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = { title: string; description: string };

export function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>♻</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingHorizontal: 28, paddingVertical: 56 },
  icon: { color: colors.primary, fontSize: 34, marginBottom: 12 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  description: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 6, textAlign: 'center' },
});

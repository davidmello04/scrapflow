import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const features = [
  ['Materiais', 'Preços por quilograma'],
  ['Compras', 'Pesagem e cálculo automático'],
  ['Histórico', 'Operações e comprovantes'],
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.eyebrow}>GESTÃO DE RECICLÁVEIS</Text>
        <Text style={styles.title}>ScrapFlow</Text>
        <Text style={styles.subtitle}>Compras, pesagem e comprovantes em um fluxo simples.</Text>
        <View style={styles.grid}>
          {features.map(([title, description]) => (
            <View key={title} style={styles.card}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardText}>{description}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.badge}>Base segura pronta para evolução</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F2' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  eyebrow: { color: '#52734D', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#183A2A', fontSize: 44, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#53635B', fontSize: 18, lineHeight: 26, marginTop: 8, marginBottom: 28 },
  grid: { gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderColor: '#DDE7D9', borderWidth: 1, borderRadius: 18, padding: 18 },
  cardTitle: { color: '#183A2A', fontSize: 18, fontWeight: '700' },
  cardText: { color: '#66756D', fontSize: 14, marginTop: 4 },
  badge: { alignSelf: 'flex-start', color: '#2E5D43', backgroundColor: '#DCEBDC', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, marginTop: 24, fontWeight: '600' },
});

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialFormScreen } from '../screens/MaterialFormScreen';
import { MaterialsScreen } from '../screens/MaterialsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { NewPurchaseScreen } from '../screens/NewPurchaseScreen';
import { PurchaseReceiptScreen } from '../screens/PurchaseReceiptScreen';
import { PurchaseDetailScreen } from '../screens/PurchaseDetailScreen';
import { PurchaseHistoryScreen } from '../screens/PurchaseHistoryScreen';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTintColor: colors.primaryDark,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ScrapFlow' }} />
      <Stack.Screen name="Materials" component={MaterialsScreen} options={{ title: 'Materiais' }} />
      <Stack.Screen
        name="MaterialForm"
        component={MaterialFormScreen}
        options={({ route }) => ({ title: route.params?.material ? 'Editar material' : 'Novo material' })}
      />
      <Stack.Screen name="NewPurchase" component={NewPurchaseScreen} options={{ title: 'Nova compra' }} />
      <Stack.Screen
        name="PurchaseReceipt"
        component={PurchaseReceiptScreen}
        options={{ title: 'Compra registrada', headerBackVisible: false }}
      />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} options={{ title: 'Histórico de compras' }} />
      <Stack.Screen name="PurchaseDetail" component={PurchaseDetailScreen} options={{ title: 'Detalhes da compra' }} />
    </Stack.Navigator>
  );
}

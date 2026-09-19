import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialFormScreen } from '../screens/MaterialFormScreen';
import { MaterialsScreen } from '../screens/MaterialsScreen';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Materials"
      screenOptions={{
        headerTintColor: colors.primaryDark,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Materials" component={MaterialsScreen} options={{ title: 'Materiais' }} />
      <Stack.Screen
        name="MaterialForm"
        component={MaterialFormScreen}
        options={({ route }) => ({ title: route.params?.material ? 'Editar material' : 'Novo material' })}
      />
    </Stack.Navigator>
  );
}

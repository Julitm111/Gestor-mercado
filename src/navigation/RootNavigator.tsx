import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import ShoppingListDetailScreen from '../screens/ShoppingListDetailScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Tabs: undefined;
  ShoppingListDetail: { listId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800' },
        }}
      >
        <Stack.Screen name="Tabs" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="ShoppingListDetail"
          component={ShoppingListDetailScreen}
          options={{ title: 'Detalle de lista' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

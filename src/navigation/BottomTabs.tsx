import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import StoresScreen from '../screens/StoresScreen';
import SummaryScreen from '../screens/SummaryScreen';

export type BottomTabParamList = {
  Home: undefined;
  Catalog: undefined;
  Stores: undefined;
  Summary: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { paddingVertical: 8, height: 64 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Catalog: 'pricetags',
            Stores: 'storefront',
            Summary: 'pie-chart',
          };
          const name = icons[route.name] ?? 'ellipse';
          return <Ionicons name={name as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Listas' }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catálogo' }} />
      <Tab.Screen name="Stores" component={StoresScreen} options={{ title: 'Tiendas' }} />
      <Tab.Screen name="Summary" component={SummaryScreen} options={{ title: 'Resumen' }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;

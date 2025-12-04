import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import StoresScreen from '../screens/StoresScreen';
import SummaryScreen from '../screens/SummaryScreen';
import { colors } from '../theme/colors';

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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 72,
          paddingBottom: 12,
          paddingTop: 10,
          borderTopWidth: 0,
          backgroundColor: colors.surface,
          elevation: 8,
        },
        tabBarLabelStyle: { fontWeight: '700' },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
            Home: 'home-outline',
            Catalog: 'pricetags-outline',
            Stores: 'business-outline',
            Summary: 'pie-chart-outline',
          };
          const name = icons[route.name] ?? 'ellipse-outline';
          const iconName = (focused ? name.replace('-outline', '') : name) as React.ComponentProps<
            typeof Ionicons
          >['name'];
          return <Ionicons name={iconName} size={size + 2} color={color} />;
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

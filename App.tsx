import 'react-native-reanimated';           // primero
import 'react-native-gesture-handler';      // si lo usas
import 'react-native-get-random-values';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ShoppingDataProvider } from './src/hooks/useShoppingData';
import { colors } from './src/theme/colors';

const App: React.FC = () => {
  return (
    <ShoppingDataProvider>
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <RootNavigator />
          <StatusBar style="light" />
        </SafeAreaView>
      </View>
    </ShoppingDataProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
});

export default App;

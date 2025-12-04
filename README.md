# MercadoPlanner

Aplicación móvil offline para planificar compras de supermercado construida con **React Native + Expo + TypeScript**.

## Características
- TabNavigator con secciones de listas, catálogo, tiendas y resumen.
- Detalle de lista con agrupación por categorías, progreso y control de presupuesto.
- Catálogo y tiendas editables, todo funcionando offline usando **AsyncStorage**.
- Datos iniciales (categorías, tiendas, catálogo y una lista de ejemplo) cargados automáticamente al primer inicio.

## Estructura principal
```
App.tsx
src/
  components/
  navigation/
  screens/
  hooks/
  storage/
  types/
  utils/
```

## Scripts
- `npm start` o `npx expo start` para abrir el bundler.
- `npm run android` / `npm run ios` para compilar en cada plataforma (requiere entornos configurados).

## Cómo crear el proyecto desde cero con Expo
1. Instala Expo CLI si no la tienes: `npm install -g expo-cli`.
2. Crea el proyecto: `npx create-expo-app mercadoplanner -t expo-template-blank-typescript`.
3. Copia el contenido de este repo dentro del proyecto generado.
4. Instala dependencias adicionales usadas aquí:
   ```bash
   npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
   npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
   npm install @expo/vector-icons @react-native-async-storage/async-storage uuid
   npm install --save-dev @types/uuid
   ```
5. Ejecuta en modo desarrollo: `npx expo start`.
6. Para construir binarios: `npx expo run:android` o `npx expo run:ios`.
   También puedes usar EAS Build: `npx expo upload:*` según la plataforma.

> Nota: AsyncStorage se usa como capa de persistencia ligera para mantener la app 100% offline y evitar dependencias nativas adicionales.

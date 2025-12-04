import React, { useMemo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useShoppingData } from '../hooks/useShoppingData';
import ShoppingListItemRow from '../components/ShoppingListItemRow';
import SectionTitle from '../components/SectionTitle';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

type RouteParams = RouteProp<RootStackParamList, 'ShoppingListDetail'>;

const ShoppingListDetailScreen: React.FC = () => {
  const { params } = useRoute<RouteParams>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { shoppingLists, updateList, deleteList, addListItem, updateListItem, deleteListItem } = useShoppingData();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');

  const list = useMemo(() => shoppingLists.find((l) => l.id === params.listId), [shoppingLists, params.listId]);

  if (!list) {
    return (
      <View style={styles.container}>
        <Text>Lista no encontrada</Text>
      </View>
    );
  }

  const progress = Math.min((list.estimatedTotal / list.budget) * 100 || 0, 100);

  const handleAddItem = async () => {
    if (!itemName.trim()) return;
    await addListItem(list.id, {
      name: itemName,
      category: 'General',
      unit: 'unidades',
      quantity: Number(quantity) || 1,
      estimatedPrice: Number(price) || 0,
      store: 'Sin tienda',
    });
    setItemName('');
    setQuantity('1');
    setPrice('');
  };

  const handleDeleteList = () => {
    Alert.alert('Eliminar lista', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteList(list.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name='chevron-back' size={24} color='#fff' />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{list.name}</Text>
          <Text style={styles.subtitle}>{list.items.length} productos</Text>
        </View>
        <TouchableOpacity onPress={handleDeleteList}>
          <Ionicons name='trash-outline' size={20} color='#fff' />
        </TouchableOpacity>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Presupuesto</Text>
          <Text style={styles.progressValue}>
            ${list.estimatedTotal.toLocaleString()} / ${list.budget.toLocaleString()}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{progress.toFixed(0)}%</Text>
      </View>

      <SectionTitle title='Productos' description='Mantén al día tu lista' />
      <FlatList
        data={list.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInDown.delay(80)} style={{ marginVertical: 6 }}>
            <ShoppingListItemRow
              item={item}
              onUpdate={(changes) => updateListItem(list.id, item.id, changes)}
              onDelete={() => deleteListItem(list.id, item.id)}
            />
          </Animated.View>
        )}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        ListEmptyComponent={<Text style={styles.emptyText}>Agrega productos para empezar.</Text>}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.addItemContainer}>
        <Text style={styles.addItemTitle}>Agregar producto</Text>
        <TextInput
          style={styles.input}
          placeholder='Nombre del producto'
          placeholderTextColor={colors.textMuted}
          value={itemName}
          onChangeText={setItemName}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder='Cantidad'
            placeholderTextColor={colors.textMuted}
            keyboardType='numeric'
            value={quantity}
            onChangeText={setQuantity}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder='Precio estimado'
            placeholderTextColor={colors.textMuted}
            keyboardType='numeric'
            value={price}
            onChangeText={setPrice}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Ionicons name='add-circle' size={20} color='#fff' />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.h1,
    color: '#fff',
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
  },
  progressCard: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    ...shadows.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    ...typography.h3,
  },
  progressValue: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
    marginVertical: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  progressPercent: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  addItemContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...shadows.sm,
  },
  addItemTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  addButtonText: {
    ...typography.button,
    color: '#fff',
  },
});

export default ShoppingListDetailScreen;

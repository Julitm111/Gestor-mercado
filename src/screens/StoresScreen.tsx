import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StoreCard from '../components/StoreCard';
import SectionTitle from '../components/SectionTitle';
import ShoppingListItemRow from '../components/ShoppingListItemRow';
import { useShoppingData } from '../hooks/useShoppingData';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const StoresScreen: React.FC = () => {
  const { shoppingLists } = useShoppingData();
  const [selectedListId, setSelectedListId] = useState(shoppingLists[0]?.id);
  const [openStore, setOpenStore] = useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedListId && shoppingLists[0]) {
      setSelectedListId(shoppingLists[0].id);
    }
  }, [shoppingLists, selectedListId]);

  const currentList = useMemo(
    () => shoppingLists.find((list) => list.id === selectedListId) ?? shoppingLists[0],
    [shoppingLists, selectedListId],
  );

  const storeItems = useMemo(() => {
    const map = new Map<string, { items: typeof currentList.items; total: number }>();
    if (!currentList) return [];
    currentList.items.forEach((item) => {
      const list = map.get(item.store) ?? { items: [], total: 0 };
      const total = list.total + item.subtotal;
      map.set(item.store, { items: [...list.items, item], total });
    });
    return Array.from(map.entries()).map(([storeName, data]) => ({
      storeName,
      items: data.items,
      total: data.total,
    }));
  }, [currentList]);

  const selectedStore = storeItems.find((store) => store.storeName === openStore);

  return (
    <View style={styles.container}>
      <SectionTitle title='Tiendas' description='Revisa qué comprar en cada lugar' />
      <View style={styles.listSelector}>
        {shoppingLists.map((list) => (
          <TouchableOpacity
            key={list.id}
            onPress={() => setSelectedListId(list.id)}
            style={[styles.listChip, selectedListId === list.id && styles.listChipActive]}
          >
            <Text style={[styles.listChipText, selectedListId === list.id && styles.listChipTextActive]}>
              {list.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={storeItems}
        keyExtractor={(item) => item.storeName}
        renderItem={({ item }) => (
          <StoreCard
            name={item.storeName}
            total={item.total}
            itemsCount={item.items.length}
            onPress={() => setOpenStore(item.storeName)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl * 2 }}
        ListEmptyComponent={<Text style={styles.empty}>No hay ítems asignados a tiendas.</Text>}
      />

      <Modal visible={!!selectedStore} transparent animationType='fade'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedStore?.storeName}</Text>
            <Text style={styles.modalSubtitle}>
              Total estimado ${selectedStore?.total.toLocaleString() ?? '0'}
            </Text>
            <FlatList
              data={selectedStore?.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ShoppingListItemRow item={item} onEdit={() => {}} onDelete={() => {}} hideActions />}
              ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setOpenStore(null)}>
              <Ionicons name='close-circle' size={18} color={colors.primary} />
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  listSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  listChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  listChipText: {
    ...typography.body,
    color: colors.text,
  },
  listChipTextActive: {
    color: colors.surface,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    ...shadows.md,
    maxHeight: '80%',
  },
  modalTitle: {
    ...typography.h2,
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeText: {
    ...typography.body,
    color: colors.primary,
  },
});

export default StoresScreen;

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import FloatingButton from '../components/FloatingButton';
import CategoryChip from '../components/CategoryChip';
import SectionTitle from '../components/SectionTitle';
import { useShoppingData } from '../hooks/useShoppingData';
import { Product } from '../types/models';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const CatalogScreen: React.FC = () => {
  const { products, categories, stores, addProduct, updateProduct, deleteProduct, addStore } = useShoppingData();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', category: '', unit: '', defaultStore: '', estimatedPrice: '' });
  const [filterCategory, setFilterCategory] = useState('');
  const [query, setQuery] = useState('');

  const openModal = (item?: Product) => {
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name,
        category: item.category,
        unit: item.unit,
        defaultStore: item.defaultStore,
        estimatedPrice: item.estimatedPrice.toString(),
      });
    } else {
      setEditingItem(null);
      setForm({
        name: '',
        category: categories[0] ?? '',
        unit: '',
        defaultStore: stores[0]?.name ?? '',
        estimatedPrice: '',
      });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category.trim()) return;
    const price = Number(form.estimatedPrice) || 0;
    if (!price) return;
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      unit: form.unit.trim() || 'unidad',
      defaultStore: form.defaultStore.trim() || stores[0]?.name || 'D1',
      estimatedPrice: price,
    };
    if (editingItem) {
      await updateProduct(editingItem.id, payload);
      await addStore(payload.defaultStore);
    } else {
      await addProduct(payload);
      await addStore(payload.defaultStore);
    }
    setModalVisible(false);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => (filterCategory ? item.category === filterCategory : true))
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }, [products, filterCategory, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();
    filteredProducts.forEach((product) => {
      const key = product.category;
      const items = map.get(key) ?? [];
      map.set(key, [...items, product]);
    });
    return Array.from(map.entries());
  }, [filteredProducts]);

  return (
    <View style={styles.container}>
      <SectionTitle title='Catálogo' description='Productos base para tus listas' />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
        <CategoryChip label='Todos' selected={!filterCategory} onPress={() => setFilterCategory('')} />
        {categories.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            selected={filterCategory === category}
            onPress={() => setFilterCategory(category)}
          />
        ))}
      </ScrollView>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name='search-outline' size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder='Buscar en catálogo'
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl * 2 }}>
        {grouped.map(([category, items]) => (
          <View key={category} style={styles.group}>
            <Text style={styles.groupTitle}>{category}</Text>
            {items.map((item) => (
              <ProductCard
                key={item.id}
                name={item.name}
                category={item.category}
                unit={item.unit}
                store={item.defaultStore}
                estimatedPrice={item.estimatedPrice}
                onPress={() => openModal(item)}
                onDelete={() => deleteProduct(item.id)}
              />
            ))}
          </View>
        ))}
        {grouped.length === 0 ? <Text style={styles.empty}>No hay productos en el catálogo.</Text> : null}
      </ScrollView>

      <FloatingButton
        label='Agregar'
        icon={<Ionicons name='add-circle' size={24} color='#fff' />}
        onPress={() => openModal()}
      />

      <Modal visible={modalVisible} transparent animationType='fade'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingItem ? 'Editar producto' : 'Nuevo producto'}</Text>
            <TextInput
              style={styles.input}
              placeholder='Nombre'
              placeholderTextColor={colors.textMuted}
              value={form.name}
              onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
            />
            <Text style={styles.label}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
              {categories.map((category) => (
                <CategoryChip
                  key={category}
                  label={category}
                  selected={form.category === category}
                  onPress={() => setForm((prev) => ({ ...prev, category }))}
                />
              ))}
              {!categories.includes(form.category) && form.category ? (
                <CategoryChip label={form.category} selected onPress={() => {}} />
              ) : null}
            </ScrollView>
            <TextInput
              style={styles.input}
              placeholder='O escribe la categoría'
              placeholderTextColor={colors.textMuted}
              value={form.category}
              onChangeText={(text) => setForm((prev) => ({ ...prev, category: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder='Unidad (ej. kg, und)'
              placeholderTextColor={colors.textMuted}
              value={form.unit}
              onChangeText={(text) => setForm((prev) => ({ ...prev, unit: text }))}
            />
            <Text style={styles.label}>Tienda sugerida</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
              {stores.map((store) => (
                <CategoryChip
                  key={store.id}
                  label={store.name}
                  selected={form.defaultStore === store.name}
                  onPress={() => setForm((prev) => ({ ...prev, defaultStore: store.name }))}
                />
              ))}
            </ScrollView>
            <TextInput
              style={styles.input}
              placeholder='O escribe la tienda'
              placeholderTextColor={colors.textMuted}
              value={form.defaultStore}
              onChangeText={(text) => setForm((prev) => ({ ...prev, defaultStore: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder='Precio estimado'
              placeholderTextColor={colors.textMuted}
              keyboardType='numeric'
              value={form.estimatedPrice}
              onChangeText={(text) => setForm((prev) => ({ ...prev, estimatedPrice: text }))}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.secondaryAction}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.primaryAction}>Guardar</Text>
              </TouchableOpacity>
            </View>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
  },
  group: {
    marginBottom: spacing.lg,
  },
  groupTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
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
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceMuted,
  },
  label: {
    ...typography.subtitle,
    marginBottom: spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  primaryAction: {
    ...typography.h3,
    color: colors.primary,
  },
  secondaryAction: {
    ...typography.body,
    color: colors.textMuted,
  },
});

export default CatalogScreen;

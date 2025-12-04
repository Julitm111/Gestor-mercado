import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { useShoppingData } from '../hooks/useShoppingData';
import { Item } from '../types/models';

const CatalogScreen: React.FC = () => {
  const { catalog, categories, stores, addCatalogItem, updateCatalogItem, deleteCatalogItem } = useShoppingData();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form, setForm] = useState({ name: '', categoryId: '', unit: '', storeId: '' });

  const openModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name,
        categoryId: item.defaultCategoryId,
        unit: item.unit ?? '',
        storeId: item.defaultStoreId ?? '',
      });
    } else {
      setEditingItem(null);
      setForm({ name: '', categoryId: categories[0]?.id ?? '', unit: '', storeId: stores[0]?.id ?? '' });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.categoryId) return;
    if (editingItem) {
      await updateCatalogItem(editingItem.id, {
        name: form.name,
        defaultCategoryId: form.categoryId,
        unit: form.unit,
        defaultStoreId: form.storeId || undefined,
      });
    } else {
      await addCatalogItem({
        name: form.name,
        defaultCategoryId: form.categoryId,
        unit: form.unit,
        defaultStoreId: form.storeId || undefined,
      });
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo de productos</Text>
      <FlatList
        data={catalog}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>
                Categoría: {categories.find((c) => c.id === item.defaultCategoryId)?.name ?? 'Sin categoría'}
              </Text>
              {item.unit ? <Text style={styles.cardSubtitle}>Unidad: {item.unit}</Text> : null}
              {item.defaultStoreId ? (
                <Text style={styles.cardSubtitle}>
                  Tienda sugerida: {stores.find((s) => s.id === item.defaultStoreId)?.name}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => deleteCatalogItem(item.id)}>
              <Text style={styles.delete}>Eliminar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Text style={styles.fabText}>+ Agregar</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingItem ? 'Editar ítem' : 'Nuevo ítem'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={form.name}
              onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
            />
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.chipsRow}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.chip, form.categoryId === category.id && styles.chipSelected]}
                  onPress={() => setForm((prev) => ({ ...prev, categoryId: category.id }))}
                >
                  <Text style={form.categoryId === category.id ? styles.chipTextSelected : styles.chipText}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Unidad (opcional)"
              value={form.unit}
              onChangeText={(text) => setForm((prev) => ({ ...prev, unit: text }))}
            />
            <Text style={styles.label}>Tienda sugerida</Text>
            <View style={styles.chipsRow}>
              {stores.map((store) => (
                <TouchableOpacity
                  key={store.id}
                  style={[styles.chip, form.storeId === store.id && styles.chipSelected]}
                  onPress={() => setForm((prev) => ({ ...prev, storeId: store.id }))}
                >
                  <Text style={form.storeId === store.id ? styles.chipTextSelected : styles.chipText}>
                    {store.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#6B7280" />
              <Button title="Guardar" onPress={handleSave} color="#4F46E5" />
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
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111827',
  },
  cardSubtitle: {
    color: '#4B5563',
  },
  delete: {
    color: '#DC2626',
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  chipText: {
    color: '#111827',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827',
  },
});

export default CatalogScreen;

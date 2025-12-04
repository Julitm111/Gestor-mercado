import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useShoppingData } from '../hooks/useShoppingData';
import ShoppingListItemRow from '../components/ShoppingListItemRow';
import { getListEstimatedTotal, getListProgressPercentage } from '../utils/calculations';
import { Category, Item, ShoppingListItem } from '../types/models';

const ShoppingListDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ShoppingListDetail'>>();
  const { listId } = route.params;
  const {
    shoppingLists,
    shoppingListItems,
    categories,
    stores,
    catalog,
    addListItem,
    updateListItem,
    deleteListItem,
    updateList,
  } = useShoppingData();

  const list = shoppingLists.find((l) => l.id === listId);
  const items = shoppingListItems.filter((item) => item.listId === listId);

  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [catalogModalVisible, setCatalogModalVisible] = useState(false);
  const [editListModal, setEditListModal] = useState(false);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    categoryId: categories[0]?.id ?? '',
    storeId: stores[0]?.id,
    quantity: '1',
    unit: '',
    estimatedPrice: '',
  });

  const resetItemForm = () => {
    setEditingItemId(null);
    setItemForm({
      name: '',
      categoryId: categories[0]?.id ?? '',
      storeId: stores[0]?.id,
      quantity: '1',
      unit: '',
      estimatedPrice: '',
    });
  };

  const openItemModal = (item?: ShoppingListItem) => {
    if (item) {
      setEditingItemId(item.id);
      setItemForm({
        name: item.name,
        categoryId: item.categoryId,
        storeId: item.storeId,
        quantity: String(item.quantity),
        unit: item.unit ?? '',
        estimatedPrice: item.estimatedPrice ? String(item.estimatedPrice) : '',
      });
    }
    setItemModalVisible(true);
  };

  const handleSaveItem = async () => {
    if (!list) return;
    if (!itemForm.name.trim()) return;
    const payload = {
      listId: list.id,
      name: itemForm.name,
      categoryId: itemForm.categoryId,
      storeId: itemForm.storeId,
      quantity: Number(itemForm.quantity) || 1,
      unit: itemForm.unit,
      estimatedPrice: itemForm.estimatedPrice ? Number(itemForm.estimatedPrice) : undefined,
      isChecked: false,
    };
    if (editingItemId) {
      await updateListItem(editingItemId, payload);
    } else {
      await addListItem(payload);
    }
    resetItemForm();
    setItemModalVisible(false);
  };

  const handleAddFromCatalog = (item: Item) => {
    setCatalogModalVisible(false);
    setItemForm({
      name: item.name,
      categoryId: item.defaultCategoryId,
      storeId: item.defaultStoreId,
      quantity: '1',
      unit: item.unit ?? '',
      estimatedPrice: '',
    });
    setItemModalVisible(true);
  };

  const handleEditList = async (name: string, budget?: number) => {
    if (!list) return;
    await updateList(list.id, { name, budget });
    setEditListModal(false);
  };

  const groupedItems = useMemo(() => {
    const groups: { category: Category; items: ShoppingListItem[] }[] = [];
    categories.forEach((category) => {
      groups.push({
        category,
        items: items.filter((item) => item.categoryId === category.id),
      });
    });
    return groups.filter((g) => g.items.length > 0);
  }, [categories, items]);

  if (!list) {
    return (
      <View style={styles.centered}>
        <Text>No se encontró la lista.</Text>
      </View>
    );
  }

  const total = getListEstimatedTotal(items);
  const progress = getListProgressPercentage(items, list.budget);

  const listNameInput = useState(list.name);
  const budgetInput = useState(list.budget?.toString() ?? '');

  const [listName, setListName] = listNameInput;
  const [listBudget, setListBudget] = budgetInput;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.headerCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.title}>{list.name}</Text>
          <TouchableOpacity onPress={() => setEditListModal(true)}>
            <Text style={styles.editLink}>Editar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Creada el {new Date(list.createdAt).toLocaleDateString()}</Text>
        {list.budget ? <Text style={styles.budget}>Presupuesto: ${list.budget.toLocaleString()}</Text> : null}
        <Text style={styles.total}>Total estimado: ${total.toLocaleString()}</Text>
        {list.budget ? (
          <View style={{ marginTop: 8 }}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% del presupuesto</Text>
          </View>
        ) : null}
      </View>

      {groupedItems.map((group) => (
        <View key={group.category.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{group.category.name}</Text>
          {group.items.map((item) => (
            <ShoppingListItemRow
              key={item.id}
              item={item}
              store={stores.find((s) => s.id === item.storeId)}
              onToggle={() => updateListItem(item.id, { isChecked: !item.isChecked })}
              onEdit={() => openItemModal(item)}
              onDelete={() => deleteListItem(item.id)}
            />
          ))}
        </View>
      ))}

      <View style={{ height: 12 }} />

      <TouchableOpacity style={styles.primaryButton} onPress={() => openItemModal()}>
        <Text style={styles.primaryText}>Agregar ítem manual</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => setCatalogModalVisible(true)}>
        <Text style={styles.secondaryText}>Agregar desde catálogo</Text>
      </TouchableOpacity>

      {/* Modal para crear/editar ítem */}
      <Modal visible={itemModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingItemId ? 'Editar ítem' : 'Nuevo ítem'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={itemForm.name}
              onChangeText={(text) => setItemForm((prev) => ({ ...prev, name: text }))}
            />
            <Text style={styles.label}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.chip, itemForm.categoryId === category.id && styles.chipSelected]}
                  onPress={() => setItemForm((prev) => ({ ...prev, categoryId: category.id }))}
                >
                  <Text style={itemForm.categoryId === category.id ? styles.chipTextSelected : styles.chipText}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Tienda</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {stores.map((store) => (
                <TouchableOpacity
                  key={store.id}
                  style={[styles.chip, itemForm.storeId === store.id && styles.chipSelected]}
                  onPress={() => setItemForm((prev) => ({ ...prev, storeId: store.id }))}
                >
                  <Text style={itemForm.storeId === store.id ? styles.chipTextSelected : styles.chipText}>
                    {store.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={styles.input}
              placeholder="Cantidad"
              keyboardType="numeric"
              value={itemForm.quantity}
              onChangeText={(text) => setItemForm((prev) => ({ ...prev, quantity: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Unidad (ej. kg, und)"
              value={itemForm.unit}
              onChangeText={(text) => setItemForm((prev) => ({ ...prev, unit: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio estimado"
              keyboardType="numeric"
              value={itemForm.estimatedPrice}
              onChangeText={(text) => setItemForm((prev) => ({ ...prev, estimatedPrice: text }))}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => { setItemModalVisible(false); resetItemForm(); }} color="#6B7280" />
              <Button title="Guardar" onPress={handleSaveItem} color="#4F46E5" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal catálogo */}
      <Modal visible={catalogModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '70%' }]}>
            <Text style={styles.modalTitle}>Catálogo</Text>
            <ScrollView>
              {catalog.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.catalogCard}
                  onPress={() => handleAddFromCatalog(item)}
                >
                  <Text style={styles.catalogTitle}>{item.name}</Text>
                  <Text style={styles.catalogSubtitle}>
                    Categoría: {categories.find((c) => c.id === item.defaultCategoryId)?.name ?? 'Sin categoría'}
                  </Text>
                  {item.unit ? <Text style={styles.catalogSubtitle}>Unidad: {item.unit}</Text> : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Cerrar" onPress={() => setCatalogModalVisible(false)} color="#6B7280" />
          </View>
        </View>
      </Modal>

      {/* Modal editar lista */}
      <Modal visible={editListModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar lista</Text>
            <TextInput style={styles.input} value={listName} onChangeText={setListName} />
            <TextInput
              style={styles.input}
              value={listBudget}
              onChangeText={setListBudget}
              placeholder="Presupuesto"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setEditListModal(false)} color="#6B7280" />
              <Button
                title="Guardar"
                color="#4F46E5"
                onPress={() => handleEditList(listName, listBudget ? Number(listBudget) : undefined)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    color: '#6B7280',
  },
  budget: {
    marginTop: 8,
    color: '#4338CA',
    fontWeight: '600',
  },
  total: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  progressBg: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  progressText: {
    marginTop: 6,
    color: '#4B5563',
    fontSize: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111827',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#EEF2FF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryText: {
    color: '#4338CA',
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
  editLink: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    backgroundColor: '#fff',
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
  catalogCard: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  catalogTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111827',
  },
  catalogSubtitle: {
    color: '#4B5563',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShoppingListDetailScreen;

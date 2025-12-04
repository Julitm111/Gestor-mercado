import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { useShoppingData } from '../hooks/useShoppingData';
import { Store } from '../types/models';

const StoresScreen: React.FC = () => {
  const { stores, addStore, updateStore, deleteStore } = useShoppingData();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const openModal = (store?: Store) => {
    if (store) {
      setEditing(store);
      setName(store.name);
      setLocation(store.location ?? '');
    } else {
      setEditing(null);
      setName('');
      setLocation('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (editing) {
      await updateStore(editing.id, { name, location });
    } else {
      await addStore({ name, location });
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tiendas</Text>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.location ? <Text style={styles.cardSubtitle}>{item.location}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => deleteStore(item.id)}>
              <Text style={styles.delete}>Eliminar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Text style={styles.fabText}>+ Agregar tienda</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? 'Editar tienda' : 'Nueva tienda'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Ubicación (opcional)"
              value={location}
              onChangeText={setLocation}
            />
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
});

export default StoresScreen;

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import ShoppingListCard from '../components/ShoppingListCard';
import { useShoppingData } from '../hooks/useShoppingData';
import { RootStackParamList } from '../navigation/RootNavigator';

const HomeScreen: React.FC = () => {
  const { shoppingLists, shoppingListItems, addList, loading } = useShoppingData();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');

  const listsWithItems = useMemo(
    () =>
      shoppingLists.map((list) => ({
        ...list,
        items: shoppingListItems.filter((item) => item.listId === list.id),
      })),
    [shoppingLists, shoppingListItems],
  );

  const handleAddList = async () => {
    if (!name.trim()) return;
    await addList({ name, budget: budget ? Number(budget) : undefined });
    setName('');
    setBudget('');
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 8 }}>Cargando datos locales...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis listas</Text>
      <FlatList
        data={listsWithItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShoppingListCard
            list={item}
            items={item.items}
            onPress={() => navigation.navigate('ShoppingListDetail', { listId: item.id })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+ Nueva lista</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear lista</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la lista"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Presupuesto (opcional)"
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#6B7280" />
              <Button title="Guardar" onPress={handleAddList} color="#4F46E5" />
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
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
    fontSize: 16,
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
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;

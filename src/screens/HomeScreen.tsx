import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ListCard from '../components/ListCard';
import FloatingButton from '../components/FloatingButton';
import SectionTitle from '../components/SectionTitle';
import { useShoppingData } from '../hooks/useShoppingData';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const HomeScreen: React.FC = () => {
  const { shoppingLists, addList } = useShoppingData();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [query, setQuery] = useState('');

  const filteredLists = useMemo(() => {
    return shoppingLists.filter((list) => list.name.toLowerCase().includes(query.toLowerCase()));
  }, [shoppingLists, query]);

  const handleAddList = async () => {
    if (!name.trim()) return;
    await addList({ name, budget: budget ? Number(budget) : 0 });
    setName('');
    setBudget('');
    setModalVisible(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Mis listas</Text>
      <Text style={styles.headerSubtitle}>Planea y controla tu presupuesto</Text>
      <View style={styles.searchBox}>
        <Ionicons name='search-outline' size={18} color={colors.surface} />
        <TextInput
          style={styles.searchInput}
          placeholder='Buscar lista'
          placeholderTextColor='rgba(255,255,255,0.8)'
          value={query}
          onChangeText={setQuery}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        <SectionTitle title='Listas activas' description='Revisa tus compras guardadas' />
        <FlatList
          data={filteredLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListCard
              list={item}
              items={item.items}
              onPress={() => navigation.navigate('ShoppingListDetail', { listId: item.id })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Crea tu primera lista para empezar a planear el mercado.</Text>
          }
          contentContainerStyle={{ paddingBottom: spacing.xxl * 2 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FloatingButton
        label='Nueva lista'
        icon={<Ionicons name='add-circle' size={24} color='#fff' />}
        onPress={() => setModalVisible(true)}
      />

      <Modal visible={modalVisible} transparent animationType='fade'>
        <View style={styles.modalOverlay}>
          <Animated.View entering={SlideInDown} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear nueva lista</Text>
            <Text style={styles.modalSubtitle}>Define un nombre y tu presupuesto objetivo.</Text>
            <TextInput
              style={styles.input}
              placeholder='Nombre de la lista'
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder='Presupuesto'
              placeholderTextColor={colors.textMuted}
              keyboardType='numeric'
              value={budget}
              onChangeText={setBudget}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.secondaryAction}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddList}>
                <Text style={styles.primaryAction}>Guardar lista</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.surface,
  },
  headerSubtitle: {
    ...typography.subtitle,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  searchBox: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.surface,
    ...typography.body,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 18,
    width: '100%',
    ...shadows.md,
  },
  modalTitle: {
    ...typography.h2,
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.textMuted,
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default HomeScreen;

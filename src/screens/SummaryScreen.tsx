import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useShoppingData } from '../hooks/useShoppingData';
import { getCategoryTotals, getListEstimatedTotal } from '../utils/calculations';

const SummaryScreen: React.FC = () => {
  const { shoppingListItems, categories } = useShoppingData();

  const totalGlobal = useMemo(() => getListEstimatedTotal(shoppingListItems), [shoppingListItems]);
  const totalsByCategory = useMemo(
    () => getCategoryTotals(shoppingListItems, categories),
    [shoppingListItems, categories],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total estimado global</Text>
        <Text style={styles.total}>${totalGlobal.toLocaleString()}</Text>
      </View>

      <Text style={styles.subtitle}>Totales por categoría</Text>
      <FlatList
        data={totalsByCategory}
        keyExtractor={(item) => item.categoryId}
        renderItem={({ item }) => {
          const categoryName = categories.find((c) => c.id === item.categoryId)?.name ?? 'Sin categoría';
          return (
            <View style={styles.categoryCard}>
              <Text style={styles.categoryName}>{categoryName}</Text>
              <Text style={styles.categoryTotal}>${item.total.toLocaleString()}</Text>
            </View>
          );
        }}
      />
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
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    color: '#4B5563',
  },
  total: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 8,
    color: '#111827',
  },
  categoryCard: {
    backgroundColor: '#EEF2FF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: '#4338CA',
    fontWeight: '700',
  },
  categoryTotal: {
    fontWeight: '700',
    color: '#111827',
  },
});

export default SummaryScreen;

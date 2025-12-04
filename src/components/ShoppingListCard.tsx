import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingList, ShoppingListItem } from '../types/models';
import { getListEstimatedTotal, getListProgressPercentage } from '../utils/calculations';

interface Props {
  list: ShoppingList;
  items: ShoppingListItem[];
  onPress: () => void;
}

const ShoppingListCard: React.FC<Props> = ({ list, items, onPress }) => {
  const estimatedTotal = getListEstimatedTotal(items);
  const progress = getListProgressPercentage(items, list.budget);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{list.name}</Text>
        {list.budget ? <Text style={styles.badge}>Presupuesto: ${list.budget.toLocaleString()}</Text> : null}
      </View>
      <Text style={styles.date}>Creada: {new Date(list.createdAt).toLocaleDateString()}</Text>
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total estimado</Text>
        <Text style={styles.total}>${estimatedTotal.toLocaleString()}</Text>
      </View>
      {list.budget ? (
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{progress}% del presupuesto</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    fontSize: 12,
    backgroundColor: '#EEF2FF',
    color: '#4338CA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  date: {
    marginTop: 4,
    color: '#6B7280',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  totalLabel: {
    color: '#4B5563',
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  progressLabel: {
    marginTop: 6,
    color: '#4B5563',
    fontSize: 12,
  },
});

export default ShoppingListCard;

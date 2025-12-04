import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingListItem, Store } from '../types/models';

interface Props {
  item: ShoppingListItem;
  store?: Store;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ShoppingListItemRow: React.FC<Props> = ({ item, store, onToggle, onEdit, onDelete }) => {
  return (
    <View style={[styles.container, item.isChecked && styles.checkedContainer]}>
      <TouchableOpacity style={styles.checkbox} onPress={onToggle}>
        <View style={[styles.checkboxInner, item.isChecked && styles.checkboxChecked]} />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.title, item.isChecked && styles.checkedText]}>{item.name}</Text>
        <Text style={styles.subtitle}>
          {item.quantity} {item.unit ?? ''} • ${item.estimatedPrice?.toLocaleString() ?? '0'}
        </Text>
        {store ? <Text style={styles.store}>Tienda: {store.name}</Text> : null}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={[styles.actionText, styles.danger]}>Borrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  checkedContainer: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 2,
  },
  store: {
    marginTop: 2,
    color: '#4B5563',
    fontSize: 12,
  },
  actions: {
    marginLeft: 8,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  actionText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  danger: {
    color: '#DC2626',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
});

export default ShoppingListItemRow;

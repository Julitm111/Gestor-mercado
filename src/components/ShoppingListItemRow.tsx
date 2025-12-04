import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOut } from 'react-native-reanimated';
import { ListItem } from '../types/models';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import Badge from './Badge';

interface Props {
  item: ListItem;
  onEdit: () => void;
  onDelete: () => void;
  hideActions?: boolean;
}

const ShoppingListItemRow: React.FC<Props> = ({ item, onEdit, onDelete, hideActions }) => {
  return (
    <Animated.View entering={FadeInRight} exiting={FadeOut} style={styles.container}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.meta}>
            {item.quantity} {item.unit}
          </Text>
          <View style={styles.badges}>
            <Badge label={item.category} />
            <Badge label={item.store} />
          </View>
          <Text style={styles.price}>${item.estimatedPrice.toLocaleString()} c/u</Text>
          <Text style={styles.subtotal}>Subtotal: ${item.subtotal.toLocaleString()}</Text>
        </View>
        {hideActions ? null : (
          <View style={styles.actions}>
            <Pressable style={styles.action} onPress={onEdit}>
              <Ionicons name='create-outline' size={20} color={colors.text} />
            </Pressable>
            <Pressable style={styles.action} onPress={onDelete}>
              <Ionicons name='trash-outline' size={20} color={colors.danger} />
            </Pressable>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  title: {
    ...typography.h3,
  },
  meta: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  price: {
    ...typography.body,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  subtotal: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs / 2,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  action: {
    padding: spacing.xs,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
  },
});

export default ShoppingListItemRow;

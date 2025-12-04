import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ShoppingList, ListItem } from '../types/models';
import { getListProgressPercentage } from '../utils/calculations';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import Badge from './Badge';

interface Props {
  list: ShoppingList;
  items: ListItem[];
  onPress: () => void;
}

const ListCard: React.FC<Props> = ({ list, items, onPress }) => {
  const estimatedTotal = list.estimatedTotal ?? 0;
  const progress = getListProgressPercentage(estimatedTotal, list.budget);
  const remaining = (list.budget ?? 0) - estimatedTotal;
  const budgetLabel = list.budget ? `Presupuesto: $${list.budget.toLocaleString()}` : 'Sin presupuesto';
  const progressColor = progress > 100 ? colors.danger : progress >= 70 ? colors.primary : colors.primaryLight;
  const barWidth = Math.min(progress, 100);

  return (
    <Animated.View entering={FadeInUp.delay(80)} style={styles.card}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.inner, pressed && { opacity: 0.95 }]}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{list.name}</Text>
            <Text style={styles.subtitle}>Creada: {new Date(list.createdAt).toLocaleDateString()}</Text>
          </View>
          <Badge label={budgetLabel} backgroundColor={colors.accentSoft} color={colors.primary} />
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total estimado</Text>
          <Text style={styles.amount}>${estimatedTotal.toLocaleString()}</Text>
        </View>

        {list.budget ? (
          <>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${barWidth}%`, backgroundColor: progressColor }]} />
            </View>
            <Text style={styles.progressHint}>
              {Math.round(progress)}% del presupuesto · Te queda ${Math.max(0, remaining).toLocaleString()}
            </Text>
          </>
        ) : (
          <Text style={styles.progressHint}>Agrega un presupuesto para ver el progreso</Text>
        )}

        <View style={styles.footer}>
          <Badge label={`${items.length} ítems`} backgroundColor={colors.surfaceMuted} color={colors.text} />
          <View style={styles.chevron}>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    ...shadows.md,
    backgroundColor: colors.surface,
    borderRadius: 18,
  },
  inner: {
    padding: spacing.lg,
    borderRadius: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
  },
  subtitle: {
    ...typography.small,
    color: colors.textMuted,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  totalLabel: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  amount: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    backgroundColor: colors.primary,
  },
  progressHint: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListCard;

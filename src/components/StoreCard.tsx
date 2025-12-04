import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import Badge from './Badge';

interface Props {
  name: string;
  total?: number;
  itemsCount?: number;
  onPress?: () => void;
}

const StoreCard: React.FC<Props> = ({ name, total, itemsCount, onPress }) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.card}>
      <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]} onPress={onPress}>
        <View style={styles.iconCircle}>
          <Ionicons name='business-outline' size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>Productos asignados</Text>
          <View style={styles.badges}>
            {typeof itemsCount === 'number' ? <Badge label={`${itemsCount} ítems`} /> : null}
            {typeof total === 'number' ? <Badge label={`$${total.toLocaleString()}`} /> : null}
          </View>
        </View>
        <Ionicons name='chevron-forward' size={20} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h3,
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});

export default StoreCard;

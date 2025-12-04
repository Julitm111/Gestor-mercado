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
  category: string;
  store: string;
  unit: string;
  estimatedPrice: number;
  onPress?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
}

const ProductCard: React.FC<Props> = ({
  name,
  category,
  store,
  unit,
  estimatedPrice,
  onPress,
  onDelete,
  onAdd,
}) => {
  return (
    <Animated.View entering={FadeIn.delay(100)} exiting={FadeOut} style={styles.card}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}>
        <View style={styles.info}>
          <View style={styles.avatar}>
            <Ionicons name='pricetag-outline' size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{category}</Text>
            <Text style={styles.unit}>{unit}</Text>
            <View style={styles.badges}>
              <Badge label={store} />
              <Badge label={`$${estimatedPrice.toLocaleString()} c/u`} />
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          {onPress ? (
            <Pressable style={styles.iconButton} onPress={onPress}>
              <Ionicons name='create-outline' size={22} color={colors.text} />
            </Pressable>
          ) : null}
          {onAdd ? (
            <Pressable style={styles.iconButton} onPress={onAdd}>
              <Ionicons name='add-circle' size={26} color={colors.primary} />
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable style={styles.iconButton} onPress={onDelete}>
              <Ionicons name='trash-outline' size={22} color={colors.danger} />
            </Pressable>
          ) : null}
          <Ionicons name='chevron-forward' size={20} color={colors.textMuted} />
        </View>
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
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  avatar: {
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
  unit: {
    ...typography.small,
    color: colors.textSecondary,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
  },
});

export default ProductCard;

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import SectionTitle from '../components/SectionTitle';
import { useShoppingData } from '../hooks/useShoppingData';
import { getCategoryTotals, getTotalsByStore } from '../utils/calculations';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const SummaryScreen: React.FC = () => {
  const { shoppingLists } = useShoppingData();
  const allItems = shoppingLists.flatMap((list) => list.items);

  const totalGlobal = useMemo(
    () => shoppingLists.reduce((sum, list) => sum + (list.estimatedTotal || 0), 0),
    [shoppingLists],
  );
  const totalsByCategory = useMemo(() => getCategoryTotals(allItems), [allItems]);
  const totalsByStore = useMemo(() => getTotalsByStore(allItems), [allItems]);

  return (
    <View style={styles.container}>
      <SectionTitle title='Resumen' description='Totales estimados por lista, categoría y tienda' />
      <Animated.View entering={FadeIn} style={styles.heroCard}>
        <View>
          <Text style={styles.heroLabel}>Total global</Text>
          <Text style={styles.heroTotal}>${totalGlobal.toLocaleString()}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{shoppingLists.length} listas</Text>
        </View>
      </Animated.View>

      <Text style={styles.subtitle}>Totales por categoría</Text>
      <FlatList
        data={totalsByCategory}
        keyExtractor={(item) => item.category}
        renderItem={({ item }) => (
          <Animated.View entering={FadeIn.delay(50)} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.category}</Text>
              <Text style={styles.cardLabel}>Controla tus compras por sección</Text>
            </View>
            <Text style={styles.cardTotal}>${item.total.toLocaleString()}</Text>
          </Animated.View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        showsVerticalScrollIndicator={false}
      />

      <Text style={[styles.subtitle, { marginTop: spacing.lg }]}>Totales por tienda</Text>
      <FlatList
        data={totalsByStore.filter((store) => store.total > 0)}
        keyExtractor={(item) => item.store}
        renderItem={({ item }) => (
          <Animated.View entering={FadeIn.delay(50)} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.store}</Text>
              <Text style={styles.cardLabel}>Compras en esta tienda</Text>
            </View>
            <Text style={styles.cardTotal}>${item.total.toLocaleString()}</Text>
          </Animated.View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  heroLabel: {
    ...typography.subtitle,
    color: '#FFE0B2',
  },
  heroTotal: {
    ...typography.h1,
    color: '#fff',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 14,
  },
  badgeText: {
    ...typography.body,
    color: '#fff',
  },
  subtitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.sm,
  },
  cardTitle: {
    ...typography.h3,
  },
  cardLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  cardTotal: {
    ...typography.h2,
    color: colors.primary,
  },
});

export default SummaryScreen;

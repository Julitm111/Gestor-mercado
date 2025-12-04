import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props {
  label: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

const Badge: React.FC<Props> = ({ label, color = colors.primary, backgroundColor = colors.accentSoft, style }) => (
  <View style={[styles.container, { backgroundColor }, style]}>
    <Text style={[styles.text, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 14,
  },
  text: {
    ...typography.small,
    fontWeight: '700',
  },
});

export default Badge;

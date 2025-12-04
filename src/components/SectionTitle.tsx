import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface Props {
  title: string;
  description?: string;
  style?: ViewStyle;
}

const SectionTitle: React.FC<Props> = ({ title, description, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.accent} />
      <View>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  accent: {
    width: 6,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.h3,
  },
  description: {
    ...typography.small,
  },
});

export default SectionTitle;

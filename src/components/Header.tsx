import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onRightPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, rightIcon, onRightPress }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress} activeOpacity={0.8}>
            <Ionicons name={rightIcon!} size={22} color={colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h1,
    color: '#fff',
  },
  subtitle: {
    ...typography.subtitle,
    marginTop: spacing.xs,
    color: colors.accentSoft,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default Header;

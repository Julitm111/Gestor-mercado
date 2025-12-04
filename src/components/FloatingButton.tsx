import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Pressable } from 'react-native';

interface Props {
  label?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

const FloatingButton: React.FC<Props> = ({ label = 'Nueva', icon, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
      >
        {icon}
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xxl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
    backgroundColor: colors.primary,
    gap: spacing.sm,
    ...shadows.lg,
  },
  label: {
    ...typography.h3,
    color: '#fff',
    fontSize: 16,
  },
});

export default FloatingButton;

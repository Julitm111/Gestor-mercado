import { Platform } from 'react-native';
import { colors } from './colors';

type ShadowLevel = 'sm' | 'md' | 'lg';

const iosShadow = (height: number) => ({
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: height / 2 },
  shadowOpacity: 0.08,
  shadowRadius: height,
});

const androidShadow = (elevation: number) => ({ elevation });

export const shadows: Record<ShadowLevel, object> = {
  sm: Platform.OS === 'ios' ? iosShadow(3) : androidShadow(2),
  md: Platform.OS === 'ios' ? iosShadow(6) : androidShadow(4),
  lg: Platform.OS === 'ios' ? iosShadow(10) : androidShadow(6),
};

export type ShadowTokens = typeof shadows;

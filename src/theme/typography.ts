import { TextStyle } from 'react-native';
import { colors } from './colors';

const base: TextStyle = {
  color: colors.text,
  fontFamily: 'System',
};

export const typography = {
  h1: { ...base, fontSize: 28, fontWeight: '800' as const },
  h2: { ...base, fontSize: 22, fontWeight: '700' as const },
  h3: { ...base, fontSize: 18, fontWeight: '700' as const },
  subtitle: { ...base, fontSize: 14, fontWeight: '600' as const, color: colors.textSecondary },
  body: { ...base, fontSize: 14, fontWeight: '500' as const },
  small: { ...base, fontSize: 12, color: colors.textMuted },
};

export type TypographyTokens = typeof typography;

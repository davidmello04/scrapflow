import { DefaultTheme, type Theme } from '@react-navigation/native';

export const colors = {
  background: '#F4F7F2',
  surface: '#FFFFFF',
  primary: '#2E5D43',
  primaryDark: '#183A2A',
  primarySoft: '#DCEBDC',
  text: '#183A2A',
  textMuted: '#66756D',
  border: '#DDE7D9',
  danger: '#A13D3D',
  dangerSoft: '#F7E4E1',
};

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

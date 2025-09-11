/**
 * Tailwind-inspired utility classes for React Native
 * Use these instead of StyleSheet for better DX
 */

// Colors
export const colors = {
  // Primary brand colors
  primary: '#7CB342',
  primaryDark: '#689F38',
  primaryLight: '#AED581',
  
  // Grays
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Greens (for decorative elements)
  green300: '#86efac',
  green400: '#4ade80',
  green500: '#22c55e',
  green600: '#16a34a',
  
  // Status colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Common
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

// Spacing scale (4px base)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 64,
};

// Font weights
export const fontWeight = {
  thin: '100' as const,
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

/**
 * Utility function to combine styles
 * Usage: style={tw('bg-white p-4 rounded-lg')}
 */
export const tw = (classes: string) => {
  const classArray = classes.split(' ').filter(Boolean);
  const styles: any = {};
  
  classArray.forEach(className => {
    const style = getStyleForClass(className);
    if (style) {
      Object.assign(styles, style);
    }
  });
  
  return styles;
};

/**
 * Individual utility functions (better TypeScript support)
 */
export const utils = {
  // Layout
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' as const },
  flexCol: { flexDirection: 'column' as const },
  flexGrow: { flexGrow: 1 },
  itemsCenter: { alignItems: 'center' as const },
  
  // Width
  wFull: { width: '100%' },
  
  // Position
  absolute: { position: 'absolute' as const },
  
  itemsStart: { alignItems: 'flex-start' as const },
  itemsEnd: { alignItems: 'flex-end' as const },
  justifyCenter: { justifyContent: 'center' as const },
  justifyBetween: { justifyContent: 'space-between' as const },
  justifyAround: { justifyContent: 'space-around' as const },
  justifyEvenly: { justifyContent: 'space-evenly' as const },
  justifyEnd: { justifyContent: 'flex-end' as const },
  
  // Positioning
  absolute: { position: 'absolute' as const },
  relative: { position: 'relative' as const },
  
  // Padding
  p0: { padding: spacing[0] },
  p1: { padding: spacing[1] },
  p2: { padding: spacing[2] },
  p3: { padding: spacing[3] },
  p4: { padding: spacing[4] },
  p5: { padding: spacing[5] },
  p6: { padding: spacing[6] },
  p8: { padding: spacing[8] },
  
  px1: { paddingHorizontal: spacing[1] },
  px2: { paddingHorizontal: spacing[2] },
  px3: { paddingHorizontal: spacing[3] },
  px4: { paddingHorizontal: spacing[4] },
  px5: { paddingHorizontal: spacing[5] },
  px6: { paddingHorizontal: spacing[6] },
  px8: { paddingHorizontal: spacing[8] },
  
  py1: { paddingVertical: spacing[1] },
  py2: { paddingVertical: spacing[2] },
  py3: { paddingVertical: spacing[3] },
  py4: { paddingVertical: spacing[4] },
  py5: { paddingVertical: spacing[5] },
  py6: { paddingVertical: spacing[6] },
  py8: { paddingVertical: spacing[8] },
  
  pb1: { paddingBottom: spacing[1] },
  pb2: { paddingBottom: spacing[2] },
  pb3: { paddingBottom: spacing[3] },
  pb4: { paddingBottom: spacing[4] },
  pb5: { paddingBottom: spacing[5] },
  pb6: { paddingBottom: spacing[6] },
  pb8: { paddingBottom: spacing[8] },
  
  // Margin
  m0: { margin: spacing[0] },
  m1: { margin: spacing[1] },
  m2: { margin: spacing[2] },
  m3: { margin: spacing[3] },
  m4: { margin: spacing[4] },
  m5: { margin: spacing[5] },
  m6: { margin: spacing[6] },
  m8: { margin: spacing[8] },
  
  mx1: { marginHorizontal: spacing[1] },
  mx2: { marginHorizontal: spacing[2] },
  mx3: { marginHorizontal: spacing[3] },
  mx4: { marginHorizontal: spacing[4] },
  mx5: { marginHorizontal: spacing[5] },
  mx6: { marginHorizontal: spacing[6] },
  mx8: { marginHorizontal: spacing[8] },
  
  my1: { marginVertical: spacing[1] },
  my2: { marginVertical: spacing[2] },
  my3: { marginVertical: spacing[3] },
  my4: { marginVertical: spacing[4] },
  my5: { marginVertical: spacing[5] },
  my6: { marginVertical: spacing[6] },
  my8: { marginVertical: spacing[8] },
  
  mb1: { marginBottom: spacing[1] },
  mb2: { marginBottom: spacing[2] },
  mb3: { marginBottom: spacing[3] },
  mb4: { marginBottom: spacing[4] },
  mb5: { marginBottom: spacing[5] },
  mb6: { marginBottom: spacing[6] },
  mb8: { marginBottom: spacing[8] },
  mb12: { marginBottom: spacing[12] },
  
  mt1: { marginTop: spacing[1] },
  mt2: { marginTop: spacing[2] },
  mt3: { marginTop: spacing[3] },
  mt4: { marginTop: spacing[4] },
  mt5: { marginTop: spacing[5] },
  mt6: { marginTop: spacing[6] },
  mt8: { marginTop: spacing[8] },
  
  mr1: { marginRight: spacing[1] },
  mr2: { marginRight: spacing[2] },
  mr3: { marginRight: spacing[3] },
  mr4: { marginRight: spacing[4] },
  mr5: { marginRight: spacing[5] },
  mr6: { marginRight: spacing[6] },
  mr8: { marginRight: spacing[8] },
  
  // Background colors
  bgWhite: { backgroundColor: colors.white },
  bgGray50: { backgroundColor: colors.gray50 },
  bgGray100: { backgroundColor: colors.gray100 },
  bgGray200: { backgroundColor: colors.gray200 },
  bgGray300: { backgroundColor: colors.gray300 },
  bgGray400: { backgroundColor: colors.gray400 },
  bgGray500: { backgroundColor: colors.gray500 },
  bgPrimary: { backgroundColor: colors.primary },
  bgSuccess: { backgroundColor: colors.success },
  bgError: { backgroundColor: colors.error },
  bgTransparent: { backgroundColor: colors.transparent },
  
  // Text colors
  textWhite: { color: colors.white },
  textBlack: { color: colors.black },
  textGray400: { color: colors.gray400 },
  textGray500: { color: colors.gray500 },
  textGray600: { color: colors.gray600 },
  textGray700: { color: colors.gray700 },
  textGray800: { color: colors.gray800 },
  textGray900: { color: colors.gray900 },
  textPrimary: { color: colors.primary },
  textSuccess: { color: colors.success },
  textError: { color: colors.error },
  
  // Font sizes
  textXs: { fontSize: fontSize.xs },
  textSm: { fontSize: fontSize.sm },
  textBase: { fontSize: fontSize.base },
  textLg: { fontSize: fontSize.lg },
  textXl: { fontSize: fontSize.xl },
  text2xl: { fontSize: fontSize['2xl'] },
  text3xl: { fontSize: fontSize['3xl'] },
  text4xl: { fontSize: fontSize['4xl'] },
  
  // Font weights
  fontThin: { fontWeight: fontWeight.thin },
  fontLight: { fontWeight: fontWeight.light },
  fontNormal: { fontWeight: fontWeight.normal },
  fontMedium: { fontWeight: fontWeight.medium },
  fontSemibold: { fontWeight: fontWeight.semibold },
  fontBold: { fontWeight: fontWeight.bold },
  
  // Border radius
  rounded: { borderRadius: borderRadius.base },
  roundedSm: { borderRadius: borderRadius.sm },
  roundedMd: { borderRadius: borderRadius.md },
  roundedLg: { borderRadius: borderRadius.lg },
  roundedXl: { borderRadius: borderRadius.xl },
  rounded2xl: { borderRadius: borderRadius['2xl'] },
  rounded3xl: { borderRadius: borderRadius['3xl'] },
  roundedFull: { borderRadius: borderRadius.full },
  
  // Border
  border: { borderWidth: 1 },
  border2: { borderWidth: 2 },
  borderGray200: { borderColor: colors.gray200 },
  borderGray300: { borderColor: colors.gray300 },
  borderPrimary: { borderColor: colors.primary },
  
  // Shadow (iOS)
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shadowLg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  
  // Elevation (Android)
  elevation1: { elevation: 1 },
  elevation2: { elevation: 2 },
  elevation4: { elevation: 4 },
  elevation8: { elevation: 8 },
};

// Helper function for string-based classes (if you prefer that syntax)
function getStyleForClass(className: string): any {
  // This would be a more complex implementation
  // For now, use the utils object above
  return null;
}

// Export commonly used combinations
export const commonStyles = {
  container: [utils.flex1, utils.bgWhite],
  card: [utils.bgWhite, utils.p4, utils.rounded2xl, utils.shadow, utils.mb4],
  button: [utils.bgPrimary, utils.py3, utils.px6, utils.roundedLg, utils.itemsCenter],
  buttonText: [utils.textWhite, utils.fontMedium, utils.textBase],
  input: [
    utils.border,
    utils.borderGray300,
    utils.rounded,
    utils.px3,
    utils.py3,
    utils.textBase,
  ],
  title: [utils.text2xl, utils.fontBold, utils.textGray900, utils.mb4],
  subtitle: [utils.textLg, utils.fontSemibold, utils.textGray700, utils.mb2],
  body: [utils.textBase, utils.textGray600],
};

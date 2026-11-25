/**
 * NumeroSemanas Theme Configuration
 * ================================
 * Centralized design tokens matching globals.css CSS variables.
 * Import this file instead of hardcoding color values.
 *
 * Usage:
 *   import { theme, colors } from '@/lib/theme';
 *   <div className={`bg-[${colors.forest[800]}]`} />
 *   <div style={{ backgroundColor: theme.colors.sand[50] }} />
 */

// =============================================================================
// COLOR PALETTES (matching CSS variables in globals.css)
// =============================================================================

export const colors = {
  // Sand palette - warm cream/beige backgrounds
  sand: {
    50: "#FDFBF7", // Lightest, panel backgrounds
    100: "#F7F5EE", // Page background, muted sections
    200: "#EFECE1", // Subtle backgrounds, scrollbar track
    300: "#E2DDCF", // Hover states
    400: "#C7C0AF", // Muted borders, scrollbar thumb
    border: "#E9E4D8", // Primary border color
  },

  // Forest palette - primary brand greens (dark to medium)
  forest: {
    900: "#141E16", // Darkest - headings, primary text
    800: "#1E2B20", // Primary buttons, strong emphasis
    700: "#2A3C2D", // Hover states, secondary buttons
    600: "#3D5441", // Accents, icons
    500: "#4E6A53", // Lighter accent
  },

  // Olive palette - secondary greens (muted/sage tones)
  olive: {
    700: "#525B40", // Dark olive
    600: "#687252", // Medium olive, focus outlines
    500: "#7E8A65", // Sage green
    100: "#EEF0E6", // Light olive/mint background
    50: "#F6F7F2", // Lightest olive tint
  },

  // Amber/Gold accents
  amber: {
    soft: "#D97706", // Muted amber
    300: "#FCD34D", // Light gold
    400: "#FBBF24", // Primary amber
  },

  // Utility colors
  white: "#FFFFFF",
  black: "#000000",
} as const;

// =============================================================================
// SEMANTIC COLOR ALIASES (for specific use cases)
// =============================================================================

export const semantic = {
  // Backgrounds
  page: colors.sand[100], // Main page background
  card: colors.white, // Card backgrounds
  panel: colors.sand[50], // Elevated panels
  muted: colors.sand[200], // Muted sections

  // Borders
  border: colors.sand.border, // Primary border
  borderMuted: colors.sand[400], // Subtle border

  // Text
  ink: "#263028", // Body text
  textMuted: "#57534e", // Muted text (stone-600)

  // Brand shortcuts
  cream: colors.sand[100],
  mint: colors.olive[100],
  tan: colors.sand[400],
  sage: colors.olive[500],
  olive: colors.olive[600],
  oliveDark: colors.olive[700],
  forest: colors.forest[800],

  // Status colors
  success: "#10B981", // emerald-500
  warning: colors.amber[400],
  error: "#EF4444", // red-500
  info: "#3B82F6", // blue-500
} as const;

// =============================================================================
// PDF COLORS (from CLAUDE.md brand guidelines)
// =============================================================================

export const pdf = {
  ink: semantic.ink,
  forest: colors.forest[800],
  forestHover: colors.forest[700],
  olive: colors.olive[600],
  oliveDark: colors.olive[700],
  sage: colors.olive[500],
  mint: colors.olive[100],
  cream: colors.sand[100],
  panel: colors.sand[50],
  muted: colors.sand[200],
  border: colors.sand.border,
  borderMuted: colors.sand[400],
  textMuted: semantic.textMuted,
  amber: colors.amber[400],
  amberSoft: colors.amber.soft,
  white: colors.white,
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fontFamily: {
    // CSS values for inline styles
    sans: 'var(--font-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
    serif: 'var(--font-playfair), "Playfair Display", Georgia, serif',
    heading: 'var(--font-playfair), "Playfair Display", Georgia, serif',
  },
  // Tailwind classes
  classes: {
    sans: "font-sans", // Plus Jakarta Sans - body text, UI elements
    serif: "font-serif", // Playfair Display - headings, titles
    heading: "font-serif",
    // Logo style (matches navbar)
    logo: "font-sans font-bold tracking-tight",
    // Large display numbers
    display: "font-serif font-bold tracking-tight",
  },
  // Font sizes for key elements
  sizes: {
    // Hero "Semana XX" display
    heroWord: "text-5xl sm:text-6xl lg:text-8xl",
    heroNumber: "text-7xl sm:text-8xl lg:text-9xl",
    // Page titles
    pageTitle: "text-3xl sm:text-4xl lg:text-5xl",
    // Section headers
    sectionTitle: "text-2xl sm:text-3xl",
    // Card titles
    cardTitle: "text-xl",
  },
} as const;

// =============================================================================
// SHADOWS (matching CSS variables)
// =============================================================================

export const shadows = {
  subtle: "0 4px 20px -2px rgba(30, 43, 32, 0.05)",
  card: "0 8px 30px -4px rgba(30, 43, 32, 0.07)",
  elevated: "0 14px 40px -6px rgba(30, 43, 32, 0.12)",
  // Tailwind-compatible bracket syntax
  tw: {
    subtle: "shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)]",
    card: "shadow-[0_8px_30px_-4px_rgba(30,43,32,0.07)]",
    elevated: "shadow-[0_14px_40px_-6px_rgba(30,43,32,0.12)]",
  },
} as const;

// =============================================================================
// SPACING & LAYOUT
// =============================================================================

export const spacing = {
  section: {
    gap: "space-y-6",
    padding: "pt-6",
    full: "space-y-6 pt-6",
  },
  card: {
    base: "p-6",
    responsive: "p-6 sm:p-7",
    large: "p-6 sm:p-8",
  },
  container: {
    maxWidth: "max-w-7xl",
    padding: "px-4 sm:px-6 lg:px-8",
  },
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const radius = {
  sm: "rounded-lg", // 8px
  md: "rounded-xl", // 12px
  lg: "rounded-2xl", // 16px
  xl: "rounded-3xl", // 24px
  full: "rounded-full",
  // Pixel values for inline styles
  values: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },
} as const;

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transitions = {
  base: "transition",
  fast: "transition duration-150",
  normal: "transition duration-200",
  slow: "transition duration-300",
} as const;

// =============================================================================
// COMPONENT PRESETS (ready-to-use Tailwind class strings)
// =============================================================================

export const components = {
  // Badges
  badge: {
    base: "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
    primary: `rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[${colors.sand[100]}] text-[${colors.forest[800]}]`,
    muted: `rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[${colors.sand[100]}] text-stone-600`,
    dark: `rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[${colors.forest[800]}] text-white`,
    bordered: `rounded-full border border-[${colors.sand.border}] bg-[${colors.sand[100]}] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[${colors.forest[700]}]`,
  },

  // Cards
  card: {
    base: `rounded-3xl border border-[${colors.sand.border}] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] transition hover:shadow-[0_8px_30px_-4px_rgba(30,43,32,0.07)]`,
    interactive: `rounded-3xl border border-[${colors.sand.border}] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] transition hover:border-[${colors.forest[600]}]/50 hover:shadow-[0_8px_30px_-4px_rgba(30,43,32,0.07)]`,
    featured: `rounded-3xl border-2 border-[${colors.forest[800]}] p-6 shadow-[0_8px_30px_-4px_rgba(30,43,32,0.07)]`,
  },

  // Buttons
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-xl bg-[${colors.forest[800]}] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[${colors.forest[700]}]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-xl border border-[${colors.sand.border}] bg-[${colors.sand[50]}] px-4 py-2.5 text-xs font-bold text-[${colors.forest[900]}] shadow-sm transition hover:border-[${colors.forest[800]}] hover:bg-[${colors.forest[800]}] hover:text-white`,
    ghost: `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-[${colors.forest[900]}] transition hover:bg-[${colors.sand[100]}]`,
  },

  // Section headers
  sectionHeader: {
    wrapper: "mx-auto max-w-2xl space-y-2 text-center",
    badge: `rounded-full border border-[${colors.sand.border}] bg-[${colors.sand[100]}] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[${colors.forest[700]}]`,
    title: `font-serif text-3xl font-bold text-[${colors.forest[900]}]`,
    subtitle: "text-xs text-stone-600",
  },

  // Links
  link: {
    primary: `text-[${colors.forest[800]}] hover:text-[${colors.forest[700]}] transition`,
    muted: "text-stone-600 hover:text-stone-900 transition",
  },

  // Focus states
  focus: `focus-visible:outline-3 focus-visible:outline-[${colors.olive[600]}] focus-visible:outline-offset-2`,
} as const;

// =============================================================================
// ICON SIZES
// =============================================================================

export const iconSizes = {
  xs: "h-2.5 w-2.5",
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
} as const;

// =============================================================================
// QUICK ACCESS CONSTANTS
// =============================================================================

/** Most commonly used colors as flat constants */
export const COLORS = {
  // Backgrounds
  BG_PAGE: colors.sand[100],
  BG_CARD: colors.white,
  BG_PANEL: colors.sand[50],
  BG_MUTED: colors.sand[200],
  BG_MINT: colors.olive[100],

  // Borders
  BORDER: colors.sand.border,
  BORDER_MUTED: colors.sand[400],

  // Primary brand
  PRIMARY: colors.forest[800],
  PRIMARY_DARK: colors.forest[900],
  PRIMARY_HOVER: colors.forest[700],
  ACCENT: colors.forest[600],

  // Secondary
  OLIVE: colors.olive[600],
  SAGE: colors.olive[500],

  // Text
  TEXT: colors.forest[900],
  TEXT_BODY: "#263028",
  TEXT_MUTED: "#57534e",

  // PDF colors
  PDF_FOREST: pdf.forest,
  PDF_OLIVE: pdf.olive,
  PDF_SAGE: pdf.sage,
  PDF_CREAM: pdf.cream,
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Generate Tailwind bg-[hex] class */
export const bg = (hex: string) => `bg-[${hex}]`;

/** Generate Tailwind text-[hex] class */
export const text = (hex: string) => `text-[${hex}]`;

/** Generate Tailwind border-[hex] class */
export const border = (hex: string) => `border-[${hex}]`;

/** Generate Tailwind shadow-[value] class */
export const shadow = (value: string) => `shadow-[${value.replace(/ /g, "_")}]`;

// =============================================================================
// FULL THEME EXPORT
// =============================================================================

export const theme = {
  colors,
  semantic,
  pdf,
  typography,
  shadows,
  spacing,
  radius,
  transitions,
  components,
  iconSizes,
} as const;

export default theme;

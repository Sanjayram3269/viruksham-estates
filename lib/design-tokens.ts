export const colors = {
  forestGreen: "#1e3a2b",
  deepForest: "#14261c",
  leafGreen: "#2e523c",
  warmIvory: "#faf8f5",
  warmSand: "#f2ece4",
  charcoal: "#1c1917",
  mutedStone: "#645d57",
  softBorder: "#e7e2d9",
} as const;

export const spacing = {
  section: {
    mobile: "py-16",
    tablet: "md:py-24",
    desktop: "lg:py-32",
  },
  container: {
    padding: "px-4 sm:px-6 lg:px-8",
    maxWidth: "max-w-7xl",
  },
  contentGap: {
    small: "gap-4",
    medium: "gap-6",
    large: "gap-8",
  },
} as const;

export const radii = {
  small: "rounded-sm",
  medium: "rounded",
  large: "rounded-md",
} as const;

export const shadows = {
  subtle: "0 1px 3px 0 rgba(28, 25, 23, 0.04)",
  elevated: "0 4px 12px 0 rgba(28, 25, 23, 0.06)",
} as const;

export const designTokens = {
  colors,
  spacing,
  radii,
  shadows,
} as const;

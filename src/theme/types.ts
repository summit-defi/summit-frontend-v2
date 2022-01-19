export type Breakpoints = string[]

export type MediaQueries = {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  nav: string
  invNav: string
}

export type Spacing = number[]

export type Radii = {
  small: string
  default: string
  card: string
  circle: string
}

export type Shadows = {
  level1: string
  active: string
  success: string
  warning: string
  focus: string
  inset: string
}

export type Gradients = {
  bubblegum: string
}

export type Colors = {
  primary: string
  primaryBright: string
  primaryDark: string
  secondary: string
  tertiary: string
  success: string
  failure: string
  warning: string
  contrast: string
  invertedContrast: string
  input: string
  inputSecondary: string
  background: string
  cardHover: string
  backgroundDisabled: string
  text: string
  textShadow: string
  textDisabled: string
  textSubtle: string
  borderColor: string
  card: string

  textGold: string

  // Gradients
  gradients: Gradients

  // Brand colors
  binance: string

  DASH: string
  OASIS: string
  PLAINS: string
  MESA: string
  SUMMIT: string
  EXPEDITION: string

  AUDIT: string
  BETA: string
  BASE: string
}

export type ZIndices = {
  dropdown: number
  modal: number
}

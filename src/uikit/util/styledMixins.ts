import { ElevOrPalette } from 'config/constants'
import { linearGradient } from 'polished'
import { css, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'
import { getPaletteGradientStops } from 'utils'

export const pressableMixin = ({
  theme,
  disabled = false,
  hoverStyles,
  disabledStyles,
  enabledStyles,
}: {
  theme: DefaultTheme
  disabled?: boolean
  hoverStyles?: FlattenSimpleInterpolation
  disabledStyles?: FlattenSimpleInterpolation
  enabledStyles?: FlattenSimpleInterpolation
}) => {
  if (disabled) return css`
    cursor: not-allowed;
    opacity: 0.5;
    box-shadow: none;

    ${disabledStyles}
  `

  return css`
    cursor: pointer;
    opacity: 1;

    ${theme.mediaQueries.nav} {
      &:hover {
        transform: translateY(-2px);
        ${hoverStyles}
      }
    }

    &:active {
      transform: translateY(0px);
      opacity: 0.5;
    }

    ${enabledStyles}
  `
}

export const paletteLinearGradientBackground = ({
  theme,
  secondary,
  summitPalette,
}: {
  theme: DefaultTheme,
  secondary: boolean,
  summitPalette?: ElevOrPalette,
}) => {
  if (secondary && summitPalette == null) return css`
    background: ${theme.colors.text};
  `
  return css`
    background: ${linearGradient({
      colorStops: getPaletteGradientStops(summitPalette),
      toDirection: '120deg',
    })}};
  `
}

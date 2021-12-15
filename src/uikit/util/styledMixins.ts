import { css, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'

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
}) =>
  disabled
    ? css`
        cursor: not-allowed;
        opacity: 0.5;
        box-shadow: none;

        ${disabledStyles}
      `
    : css`
        cursor: pointer;
        opacity: 1;

        ${theme.mediaQueries.nav} {
          &:hover {
            transform: translateY(-2px);
            ${hoverStyles}
          }
        }

        &:active {
          transform: translateY(2px);
          box-shadow: none;
        }

        ${enabledStyles}
      `

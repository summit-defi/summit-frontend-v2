import styled, { DefaultTheme } from 'styled-components'
import { space, layout, variant } from 'styled-system'
import { scaleVariants, styleVariants } from './theme'
import { BaseButtonProps } from './types'

interface ThemedButtonProps extends BaseButtonProps {
  theme: DefaultTheme
  isLocked?: boolean
}

const getDisabledStyles = ({ isLoading, isLocked = false, theme }: ThemedButtonProps) => {
  if (isLocked) {
    return `
      &:disabled,
      &.summit-button--disabled {
        cursor: not-allowed;
      }
      filter: grayscale(1);
      opacity: 0.5;
      box-shadow: none;
      cursor: not-allowed;
    `
  }

  if (isLoading === true) {
    return `
      &:disabled,
      &.summit-button--disabled {
        cursor: not-allowed;
      }
      opacity: 0.5;
    `
  }

  return `
    &:disabled,
    &.summit-button--disabled {
      background-color: ${theme.colors.backgroundDisabled};
      border-color: ${theme.colors.backgroundDisabled};
      box-shadow: none;
      cursor: not-allowed;
    }
  `
}

const StyledButton = styled.button<BaseButtonProps>`
  cursor: pointer;
  align-items: center;
  border: 0;
  border-radius: 6px;
  box-shadow: 0px -1px 0px 0px rgba(14, 14, 44, 0.4) inset;
  display: inline-flex;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  outline: 0;
  transition: background-color, transform, width, 0.2s;

  &:hover:not(:disabled):not(.summit-button--disabled):not(.summit-button--disabled):not(:active) {
    /* opacity: 0.65; */
    transform: translateY(-2px);
  }

  &:active:not(:disabled):not(.summit-button--disabled):not(.summit-button--disabled) {
    /* opacity: 0.85; */
    transform: translateY(2px);
    box-shadow: none;
  }

  ${getDisabledStyles}
  ${variant({
    prop: 'scale',
    variants: scaleVariants,
  })}
  ${variant({
    variants: styleVariants,
  })}
  ${layout}
  ${space}
`

export default StyledButton

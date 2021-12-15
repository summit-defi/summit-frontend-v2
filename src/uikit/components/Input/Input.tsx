import { transparentize, darken } from 'polished'
import styled, { DefaultTheme } from 'styled-components'
import { InputProps, scales } from './types'

interface StyledInputProps extends InputProps {
  theme: DefaultTheme
}

/**
 * Priority: Warning --> Success
 */
const getBoxShadow = ({ isSuccess = false, isWarning = false, theme }: StyledInputProps) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  if (isSuccess) {
    return theme.shadows.success
  }

  return theme.shadows.inset
}

const getHeight = ({ scale = scales.MD }: StyledInputProps) => {
  switch (scale) {
    case scales.SM:
      return '32px'
    case scales.LG:
      return '48px'
    case scales.MD:
    default:
      return '40px'
  }
}

const Input = styled.input<InputProps>`
  background-color: ${({ theme }) => theme.colors.background};
  border: 0;
  border-radius: 6px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  display: block;
  font-size: 16px;
  height: ${getHeight};
  outline: 0;
  padding: 0 16px;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
    opacity: 0.5;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: ${({ theme, elevation }) =>
      `0px 0px 0px 1px ${theme.colors[elevation] || theme.colors.text}, 0px 0px 0px 4px ${transparentize(
        0.6,
        darken(0.1, theme.colors[elevation] || 'transparent'),
      )}`};
  }
`

Input.defaultProps = {
  scale: scales.MD,
  isSuccess: false,
  isWarning: false,
}

export default Input

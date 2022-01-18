import React from 'react'
import { Elevation, elevationUtils } from 'config/constants/types'
import { darken } from 'polished'
import styled, { css } from 'styled-components'
import { HighlightedText } from 'uikit'

export interface InputProps {
  endAdornment?: React.ReactNode
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  tokenSymbol?: string
  placeholder?: string
  startAdornment?: React.ReactNode
  value: string
  elevation?: Elevation
  disabled?: boolean
}

const Input: React.FC<InputProps> = ({
  elevation,
  tokenSymbol,
  endAdornment,
  onChange,
  placeholder,
  startAdornment,
  value,
  disabled = false,
}) => {
  return (
    <StyledInputWrapper disabled={disabled}>
      {!!startAdornment && startAdornment}
      <InputWrapper>
        <StyledInput
          disabled={disabled}
          elevation={elevation}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {!!tokenSymbol && <HighlightedText fontSize="12px">{tokenSymbol}</HighlightedText>}
      </InputWrapper>
      {!!endAdornment && endAdornment}
    </StyledInputWrapper>
  )
}

const StyledInputWrapper = styled.div<{ disabled: boolean }>`
  align-items: center;

  background-color: ${({ theme }) => darken(0.1, theme.colors.background)};

  border-radius: 16px;
  display: flex;
  height: 62px;
  padding: 0 ${(props) => props.theme.spacing[3]}px;
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};

  ${({ disabled }) =>
    disabled &&
    css`
      box-shadow: none;
      opacity: 0.5;
    `}
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

export const StyledInput = styled.input<{ elevation?: Elevation }>`
  width: 100%;
  background: none;
  border: 0;
  font-size: 22px;
  font-weight: bold;
  font-style: italic;
  flex: 1;
  height: 56px;
  margin: 0;
  padding: 0;
  outline: none;
  text-shadow: 1px 1px 2px gray;
  color: ${({ elevation, theme }) =>
    // eslint-disable-next-line no-nested-ternary
    darken(
      !theme.isDark ? 0.2 : 0,
      elevation === Elevation.EXPEDITION
        ? theme.colors.text
        : elevation
        ? elevationUtils.backgroundColor(elevation, theme)
        : theme.colors.text,
    )};
`

export default Input

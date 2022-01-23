import React from 'react'
import { Elevation, elevationUtils } from 'config/constants/types'
import { darken } from 'polished'
import styled, { css } from 'styled-components'
import { HighlightedText, Lock } from 'uikit'

export interface InputProps {
  endAdornment?: React.ReactNode
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  tokenSymbol?: string
  placeholder?: string
  startAdornment?: React.ReactNode
  value: string
  elevation?: Elevation
  disabled?: boolean
  isLocked?: boolean
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
  isLocked = false,
}) => {
  return (
    <StyledInputWrapper disabled={disabled} isLocked={isLocked}>
      {!!startAdornment && startAdornment}
      <InputWrapper>
        <StyledInput
          disabled={disabled || isLocked}
          elevation={elevation}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {!!tokenSymbol && <HighlightedText fontSize="12px">{tokenSymbol}</HighlightedText>}
      </InputWrapper>
      {!!endAdornment && endAdornment}
      {isLocked && <StyledLock width="28px" />}
    </StyledInputWrapper>
  )
}

const StyledInputWrapper = styled.div<{ disabled: boolean, isLocked: boolean }>`
  position: relative;
  align-items: center;

  background-color: ${({ theme }) => darken(0.1, theme.colors.background)};

  border-radius: 16px;
  display: flex;
  height: 62px;
  padding: 0 ${(props) => props.theme.spacing[3]}px;
  box-shadow: ${({ theme, isLocked }) => isLocked ? 'none' : `inset 2px 2px 4px ${theme.colors.textShadow}`};

  ${({ disabled }) =>
    disabled &&
    css`
      box-shadow: none;
      opacity: 0.5;
    `}

  ${({ isLocked }) =>
    isLocked &&
    css`
      filter: grayscale(1);
      opacity: 0.5;
    `}
`

const StyledLock = styled(Lock)`
  position: absolute;
  transform: rotate(20deg);
  fill: white;
  filter: drop-shadow(0px 0px 8px black) drop-shadow(0px 0px 2px black);
  z-index: 4;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`

const InputWrapper = styled.div`
  width: 100%;
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

import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js/bignumber'
import Input, { InputProps } from '../Input'
import SummitButton from 'uikit/components/Button/SummitButton'
import { Elevation } from 'config/constants/types'
import { Text } from 'uikit'

interface TokenInputProps extends InputProps {
  elevation?: Elevation
  max: number | string
  symbol: string
  onSelectMax?: () => void
  balanceText?: string
  feeText?: string
  feeBP?: number
  disabled?: boolean
  isLocked?: boolean
}

const TokenInput: React.FC<TokenInputProps> = ({
  elevation,
  balanceText = 'Balance',
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  feeText = 'Fee',
  feeBP = 0,
  disabled = false,
  isLocked = false,
}) => {
  return (
    <StyledTokenInput>
      <StyledMaxText bold monospace>
        {balanceText}: {parseFloat(max.toLocaleString()).toFixed(4)} {symbol}
      </StyledMaxText>
      <Input
        disabled={disabled}
        elevation={elevation}
        tokenSymbol={symbol}
        isLocked={isLocked}
        endAdornment={
          <StyledTokenAdornmentWrapper>
            <StyledSpacer />
            <div>
              <SummitButton elevation={elevation} disabled={disabled || isLocked} padding="12px" onClick={onSelectMax}>
                MAX
              </SummitButton>
            </div>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
      />
      {feeBP > 0 ? (
        <StyledFeeText monospace>{feeText}: {new BigNumber(value || 0).times(feeBP / 10000).toString()}</StyledFeeText>
      ) : null}
    </StyledTokenInput>
  )
}

const StyledTokenInput = styled.div`
  position: relative;
`

const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

const StyledMaxText = styled(Text)`
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  font-style: italic;
  margin-right: 16px;
  font-size: 12px;
  font-weight: 700;
  height: 32px;
  letter-spacing: 0.15px;
  justify-content: flex-start;
`

const StyledFeeText = styled(StyledMaxText)`
  position: absolute;
  left: 0px;
  bottom: -30px;
`

export default TokenInput

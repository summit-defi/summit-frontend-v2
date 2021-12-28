import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js/bignumber'
import Input, { InputProps } from '../Input'
import SummitButton from 'uikit/components/Button/SummitButton'
import { Elevation } from 'config/constants/types'

interface TokenInputProps extends InputProps {
  elevation?: Elevation
  max: number | string
  symbol: string
  onSelectMax?: () => void
  balanceText?: string
  depositFeeBP?: number
  withdrawalFee?: number
  disabled?: boolean
}

const TokenInput: React.FC<TokenInputProps> = ({
  elevation,
  balanceText = 'Balance',
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  depositFeeBP = 0,
  withdrawalFee = 0,
  disabled = false,
}) => {
  return (
    <StyledTokenInput>
      <StyledMaxText>
        {balanceText}: {parseFloat(max.toLocaleString()).toFixed(4)} {symbol}
      </StyledMaxText>
      <Input
        disabled={disabled}
        elevation={elevation}
        tokenSymbol={symbol}
        endAdornment={
          <StyledTokenAdornmentWrapper>
            <StyledSpacer />
            <div>
              <SummitButton elevation={elevation} disabled={disabled} padding="12px" onClick={onSelectMax}>
                MAX
              </SummitButton>
            </div>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
      />
      {depositFeeBP > 0 ? (
        <StyledFeeText>Deposit Fee: {new BigNumber(value || 0).times(depositFeeBP / 10000).toString()}</StyledFeeText>
      ) : null}
      {withdrawalFee > 0 ? (
        <StyledFeeText>
          Withdrawal Fee: {new BigNumber(value || 0).times(withdrawalFee / 10000).toString()}
        </StyledFeeText>
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

const StyledMaxText = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  font-style: italic;
  margin-right: 16px;
  font-size: 14px;
  font-weight: 700;
  height: 32px;
  justify-content: flex-start;
`

const StyledFeeText = styled(StyledMaxText)`
  position: absolute;
  left: 0px;
  bottom: -30px;
`

export default TokenInput

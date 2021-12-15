import React from 'react'
import { Text } from 'uikit'
import styled from 'styled-components'
import { getSummitLpSymbol } from 'config/constants'
import BigNumber from 'bignumber.js'
import { usePricesPerToken } from 'state/hooks'
import { PriceableTokenSymbol } from 'state/types'

const StakedToDepositedText = styled(Text)`
  text-align: center;
  margin: 0px auto 24px auto;
`

const ExpeditionStakedToDepositedInfo: React.FC = () => {
  const summitLpSymbol = getSummitLpSymbol()
  const pricesPerToken = usePricesPerToken()
  const summitPrice = pricesPerToken && pricesPerToken[PriceableTokenSymbol.SUMMIT] ? pricesPerToken[PriceableTokenSymbol.SUMMIT] : new BigNumber(1)
  const summitLpPrice = pricesPerToken && pricesPerToken[PriceableTokenSymbol.SUMMIT_FTM] ? pricesPerToken[PriceableTokenSymbol.SUMMIT_FTM] : new BigNumber(1)

  return (
    <StakedToDepositedText bold monospace>
      <Text mt="6px" fontSize="12px">
        YOUR DEPOSITED VALUE IS NEVER RISKED!
      </Text>
      1 SUMMIT = {'$'}{summitPrice.toFixed(2)} USD deposited
      <br/>
      1 {summitLpSymbol} = {'$'}{summitLpPrice.toFixed(2)} USD deposited
    </StakedToDepositedText>
  )
}

export default ExpeditionStakedToDepositedInfo

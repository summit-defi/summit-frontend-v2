import React from 'react'
import { Text } from 'uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getBalanceNumber } from 'utils/formatBalance'
import CardValue from './CardValue'
import { Elevation } from 'config/constants/types'

const V1SummitWalletBalance = ({ v1SummitBalance }) => {
  const { account } = useWallet()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '36px' }}>
        Locked
      </Text>
    )
  }

  return <CardValue value={getBalanceNumber(v1SummitBalance)} fontSize="24px" elevation={Elevation.OASIS} />
}

export default V1SummitWalletBalance

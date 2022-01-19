import React from 'react'
import { Text } from 'uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useSummitTokenBalance from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import CardValue from './CardValue'
import { Elevation } from 'config/constants/types'

const SummitWalletBalance = () => {
  const summitBalance = useSummitTokenBalance()
  const { account } = useWallet()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '36px' }}>
        Locked
      </Text>
    )
  }

  return <CardValue value={getBalanceNumber(summitBalance)} fontSize="24" elevation={Elevation.OASIS} />
}

export default SummitWalletBalance

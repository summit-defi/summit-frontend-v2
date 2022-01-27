import React from 'react'
import { useWalletModal } from 'uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import SummitButton from 'uikit/components/Button/SummitButton'

const UnlockButton = ({ summitPalette = null, ...props}) => {
  const { connect, reset } = useWallet()
  const { onPresentConnectModal } = useWalletModal(connect, reset)

  return (
    <SummitButton onClick={onPresentConnectModal} summitPalette={summitPalette} {...props}>
      CONNECT WALLET
    </SummitButton>
  )
}

export default UnlockButton

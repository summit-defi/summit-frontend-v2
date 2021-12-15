import React from 'react'
import { useWalletModal } from 'uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import SummitButton from 'uikit/components/Button/SummitButton'

const UnlockButton = ({ elevation = null, ...props}) => {
  const { connect, reset } = useWallet()
  const { onPresentConnectModal } = useWalletModal(connect, reset)

  return (
    <SummitButton onClick={onPresentConnectModal} elevation={elevation} {...props}>
      CONNECT WALLET
    </SummitButton>
  )
}

export default UnlockButton

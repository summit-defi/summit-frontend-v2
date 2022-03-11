import React from 'react'
import SummitButton from 'uikit/components/Button/SummitButton'
import useAuth from 'hooks/useAuth'

const UnlockButton = ({ summitPalette = null, ...props}) => {
  const { login, logout } = useAuth()
  const onPresentConnectModal = () => null

  return (
    <SummitButton onClick={onPresentConnectModal} summitPalette={summitPalette} {...props}>
      CONNECT WALLET
    </SummitButton>
  )
}

export default UnlockButton

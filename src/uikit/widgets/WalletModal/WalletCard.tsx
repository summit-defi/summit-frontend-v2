import { Elevation, elevationUtils } from 'config/constants/types'
import { transparentize, darken } from 'polished'
import React from 'react'
import styled from 'styled-components'
import Button from '../../components/Button/Button'
import { Text } from '../../components/Text/Text'
import { connectorLocalStorageKey } from './config'
import { Login, Config } from './types'

const StyledText = styled(Text)`
  color: ${({ theme }) => darken(0.2, elevationUtils.backgroundColor(Elevation.OASIS, theme))};
`

interface Props {
  walletConfig: Config
  login: Login
  onDismiss: () => void
  mb: string
}

const WalletCard: React.FC<Props> = ({ login, walletConfig, onDismiss, mb }) => {
  const { title, icon: Icon } = walletConfig
  return (
    <Button
      width="100%"
      variant="tertiary"
      onClick={() => {
        login(walletConfig.connectorId)
        window.localStorage.setItem(connectorLocalStorageKey, walletConfig.connectorId)
        onDismiss()
      }}
      style={{ justifyContent: 'space-between' }}
      mb={mb}
      id={`wallet-connect-${title.toLocaleLowerCase()}`}
    >
      <StyledText bold monospace mr="16px">
        {title}
      </StyledText>
      <Icon
        width="32px"
        style={{ width: '32px', filter: `drop-shadow(2px 2px 2px ${transparentize(0.5, '#000000')})` }}
      />
    </Button>
  )
}

export default WalletCard

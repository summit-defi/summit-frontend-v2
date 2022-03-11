import React from 'react'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'
import { Text } from '../../components/Text'
import styled from 'styled-components'

const PopUpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 300px;
`

interface Props {
  login: Login
  onDismiss?: () => void
}

const ConnectPopUp: React.FC<Props> = ({ login, onDismiss = () => null }) => (
  <PopUpWrapper>
    <Text bold monospace mb='24px'>Choose wallet type:</Text>
    {config.map((entry, index) => (
      <WalletCard
        key={entry.title}
        login={login}
        walletConfig={entry}
        onDismiss={onDismiss}
        mb={index < config.length - 1 ? '8px' : '0'}
      />
    ))}
  </PopUpWrapper>
)

export default ConnectPopUp

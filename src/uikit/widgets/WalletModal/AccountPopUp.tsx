import React from 'react'
import { Text } from '../../components/Text/Text'
import Flex from '../../components/Box/Flex'
import CopyToClipboard from './CopyToClipboard'
import { connectorLocalStorageKey } from './config'
import SummitButton from '../../components/Button/SummitButton'
import ExternalLinkButton from '../../components/Link/ExternalLinkButton'
import { getLinks, SummitPalette } from 'config/constants'
import { linearGradient } from 'polished'
import styled from 'styled-components'
import Divider from 'uikit/components/Divider'
import DarkModeToggle from '../Menu/components/DarkModeToggle'

const AccountDot = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 22px;
  margin-right: 12px;
  background: ${linearGradient({
    colorStops: [
      '#154463',
      '#017B88',
      '#90B7B4',
    ],
    toDirection: '120deg',
  })};
`

interface Props {
  account: string
  isDark: boolean
  toggleTheme: () => void
  logout: () => void
  onDismiss?: () => void
}

const AccountPopUp: React.FC<Props> = ({ account, isDark, toggleTheme, logout, onDismiss = () => null }) => {
  const { etherscan } = getLinks()
  const accountEtherscanLink = `${etherscan}address/${account}`
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null

  return (
    <Flex flexDirection='column' alignItems='center' justifyContent='center' gap='24px' minWidth='300px'>
      <Flex width='100%' alignItems='center' justifyContent='space-between'>
        <Text bold monospace>ACCOUNT</Text>
        <SummitButton
          secondary
          height='28px'
          width='120px'
          summitPalette={SummitPalette.BASE}
          insetColor='background'
          onClick={() => {
            logout()
            window.localStorage.removeItem(connectorLocalStorageKey)
            onDismiss()
          }}
        >
          <Text monospace small>DISCONNECT</Text>
        </SummitButton>
      </Flex>

      <Flex width='100%' alignItems='center' justifyContent='space-between'>
        <Flex>
          <AccountDot/>
          <Flex flexDirection='column' alignItems='flex-start' justifyContent='center'>
            <Text
              fontSize="16px"
              bold
              monospace
            >
              {accountEllipsis}
            </Text>
          </Flex>
        </Flex>
        <Flex gap='8px'>
          <ExternalLinkButton href={accountEtherscanLink}/>
          <CopyToClipboard toCopy={account}/>
        </Flex>

      </Flex>

      <Divider/>

      <Flex width='100%' alignItems='center' justifyContent='space-between'>
        <Text bold monospace>SITE THEME</Text>
        <DarkModeToggle summitPalette={SummitPalette.BASE} isDark={isDark} toggleTheme={toggleTheme}/>
      </Flex>


    </Flex>
  )
}

export default AccountPopUp

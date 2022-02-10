import React from 'react'
import { Text } from '../../components/Text/Text'
import Flex from '../../components/Box/Flex'
import { Modal } from '../Modal'
import CopyToClipboard from './CopyToClipboard'
import { connectorLocalStorageKey } from './config'
import SummitButton from '../../components/Button/SummitButton'
import ExternalLinkButton from '../../components/Link/ExternalLinkButton'
import { getEtherscanName, getLinks } from 'config/constants'

interface Props {
  account: string
  logout: () => void
  onDismiss?: () => void
}

const AccountModal: React.FC<Props> = ({ account, logout, onDismiss = () => null }) => {
  const { etherscan } = getLinks()
  const accountEtherscanLink = `${etherscan}/account/${account}`

  return (
    <Modal title="Your wallet" onDismiss={onDismiss} elevationCircleHeader="BASE" headerless>
      <Text
        fontSize="20px"
        bold
        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '8px' }}
      >
        {account}
      </Text>
      <Flex mb="32px">
        <ExternalLinkButton href={accountEtherscanLink} mr="16px">
          View on {getEtherscanName()}
        </ExternalLinkButton>
        <CopyToClipboard toCopy={account}>Copy Address</CopyToClipboard>
      </Flex>
      <Flex justifyContent="center">
        <SummitButton
          secondary
          onClick={() => {
            logout()
            window.localStorage.removeItem(connectorLocalStorageKey)
            onDismiss()
          }}
        >
          LOGOUT
        </SummitButton>
      </Flex>
    </Modal>
  )
}

export default AccountModal

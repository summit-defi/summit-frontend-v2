import { Elevation } from 'config/constants/types'
import { usePendingTxs } from 'hooks/usePendingTx'
import React, { useCallback } from 'react'
import { useSelectedElevation } from 'state/hooks'
import styled from 'styled-components'
import SummitButton from '../../../components/Button/SummitButton'
import { useWalletModal } from '../../WalletModal'
import { Login } from '../../WalletModal/types'

interface Props {
  account?: string
  isDark: boolean
  elevation?: Elevation
  login: Login
  logout: () => void
}

const StyledSummitButton = styled(SummitButton)`
  height: 32px;
  width: 160px;
  margin-left: 4px;
`

const UserBlock: React.FC<Props> = ({ account, login, logout }) => {
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account)
  const elevation = useSelectedElevation()
  const pendingTxs = usePendingTxs()
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null

  const handleUserBlockClicked = useCallback(() => (account ? onPresentAccountModal() : onPresentConnectModal()), [
    account,
    onPresentAccountModal,
    onPresentConnectModal,
  ])
  return (
    <div>
      <StyledSummitButton onClick={handleUserBlockClicked} elevation={elevation}>
        {account ? `${accountEllipsis}${pendingTxs.length > 0 ? ` | ${pendingTxs.length} TX` : ''}` : 'CONNECT'}
      </StyledSummitButton>
    </div>
  )
}

export default React.memo(UserBlock, (prevProps, nextProps) => prevProps.account === nextProps.account)

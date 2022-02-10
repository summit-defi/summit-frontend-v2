import React, { useCallback, useEffect, useMemo } from 'react'
import { Flex, Text } from 'uikit'
import { Elevation } from 'config/constants/types'
import { getFullDisplayBalance } from 'utils'
import SummitButton from 'uikit/components/Button/SummitButton'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import TokenInput from 'components/TokenInput'
import { useApprove } from 'hooks/useApprove'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'

interface Props {
  symbol: string
  walletBalance: BigNumber
  decimals: number
  depositFeeBP: number
  elevation: Elevation
  farmToken: string
  setPending: (boolean) => void
}

const MobileHiddenText = styled(Text)`
  ${({ theme }) => theme.mediaQueries.invNav} {
    display: none;
  }
`

const CenteredSummitButton = styled(SummitButton)`
  margin: 34px auto 0px auto;
`
const CenteredUnlockButton = styled(UnlockButton)`
  margin: 34px auto 0px auto;
`

const FarmCardUserApprove: React.FC<Props> = ({
  symbol,
  walletBalance,
  decimals,
  depositFeeBP,
  elevation,
  farmToken,
  setPending,
}) => {
  const { account } = useWeb3React()

  // APPROVE ACTION
  const { onApprove, pending: approvalPending } = useApprove(farmToken, symbol)

  useEffect(() => {
    setPending(approvalPending)
  }, [approvalPending, setPending])

  // DEPOSIT TOKEN INPUT
  const fullDepositBalance = useMemo(() => {
    return getFullDisplayBalance(walletBalance || new BigNumber(0), decimals)
  }, [walletBalance, decimals])

  const handleChangeDeposit = useCallback(
    () => null,
    [],
  )

  const handleSelectMaxDeposit = useCallback(
    () => null,
    [],
  )

  return (
    <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
      <MobileHiddenText fontSize="14px" mb="30px">
        Deposit:
      </MobileHiddenText>
      <TokenInput
        summitPalette={elevation}
        value=''
        balanceText="Wallet"
        disabled
        onSelectMax={handleSelectMaxDeposit}
        onChange={handleChangeDeposit}
        max={fullDepositBalance}
        symbol={symbol}
        feeText='Deposit Fee'
        feeBP={depositFeeBP}
      />
      { account == null ?
        <CenteredUnlockButton /> :
        <CenteredSummitButton isLoading={approvalPending} onClick={onApprove} summitPalette={elevation}>
          APPROVE {symbol}
        </CenteredSummitButton>
      }
    </Flex>
  )
}

export default React.memo(FarmCardUserApprove)

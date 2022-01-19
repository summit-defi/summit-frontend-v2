import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, Text } from 'uikit'
import { Elevation, ForceElevationRetired } from 'config/constants/types'
import { getFullDisplayBalance } from 'utils'
import { Contract } from 'web3-eth-contract'
import SummitButton from 'uikit/components/Button/SummitButton'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import TokenInput from 'components/TokenInput'
import useStake from 'hooks/useStake'
import { useApprove } from 'hooks/useApprove'
import { isNumber } from 'lodash'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useRewardsWillBeClaimedModal, RewardsWillBeClaimedType } from '../RewardsWillBeClaimedModal'

interface Props {
  farmToken: string
  symbol: string
  elevationLocked: boolean
  walletBalance: BigNumber
  decimals: number
  depositFeeBP: number
  isApproved: boolean
  elevation: Elevation
  disabled: boolean
  lpContract: Contract
  claimable: BigNumber
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

const FarmCardUserApproveDeposit: React.FC<Props> = ({
  farmToken,
  symbol,
  elevationLocked,
  walletBalance,
  decimals,
  depositFeeBP,
  isApproved,
  elevation,
  disabled,
  claimable,
  setPending,
  lpContract,
}) => {
  const { account } = useWallet()
  const whitelistedAccounts = [
    '0x3231e42a2Bb09Aa5E2d4403FC99Dab639EDe8175',
    '0xd61984812038D1BE0A185373d48074299f369b66',
    '0x072fB97C6f88675d53B584f8b2d26Ce2520Cc4bA'
  ]
  const elevationForcedDisabled = elevation !== Elevation.OASIS && ForceElevationRetired && !whitelistedAccounts.includes(account)
  // APPROVE ACTION
  const { onApprove, pending: approvalPending } = useApprove(lpContract, symbol)

  // REWARDS WILL BE CLAIMED MODAL
  const presentRewardsWillBeClaimedModal = useRewardsWillBeClaimedModal(elevation, claimable, 'Deposit', RewardsWillBeClaimedType.Farm)

  // DEPOSIT ACTION
  const { onStake, pending: stakePending } = useStake(farmToken, elevation)

  useEffect(() => {
    setPending(stakePending || approvalPending)
  }, [stakePending, approvalPending, setPending])

  // DEPOSIT TOKEN INPUT
  const [depositVal, setDepositVal] = useState('')
  const [invalidDeposit, setInvalidDepositVal] = useState(false)
  const fullDepositBalance = useMemo(() => {
    return getFullDisplayBalance(walletBalance || new BigNumber(0), decimals)
  }, [walletBalance, decimals])

  const validDepositVal = (testVal, depositBalance) => {
    return (
      testVal === '' ||
      (isNumber(parseFloat(testVal)) && parseFloat(testVal) >= 0 && parseFloat(testVal) <= parseFloat(depositBalance))
    )
  }

  const handleChangeDeposit = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setDepositVal(e.currentTarget.value)
      setInvalidDepositVal(!validDepositVal(e.currentTarget.value, fullDepositBalance))
    },
    [setDepositVal, fullDepositBalance, setInvalidDepositVal],
  )

  const handleSelectMaxDeposit = useCallback(() => {
    setDepositVal(fullDepositBalance)
    setInvalidDepositVal(!validDepositVal(fullDepositBalance, fullDepositBalance))
  }, [fullDepositBalance, setDepositVal, setInvalidDepositVal])

  const handleStake = useCallback(() => {
      presentRewardsWillBeClaimedModal({
        transactionToConfirm: () => onStake(symbol, depositVal, decimals)
      })
    },
    [
      symbol,
      depositVal,
      decimals,
      onStake,
      presentRewardsWillBeClaimedModal,
    ]
  )

  return (
    <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
      <MobileHiddenText fontSize="14px" mb="30px">
        Deposit:
      </MobileHiddenText>
      <TokenInput
        elevation={elevation}
        value={depositVal}
        balanceText="Wallet"
        disabled={disabled}
        isLocked={elevationLocked}
        onSelectMax={handleSelectMaxDeposit}
        onChange={handleChangeDeposit}
        max={fullDepositBalance}
        symbol={symbol}
        depositFeeBP={depositFeeBP}
      />
      {isApproved && (
        <CenteredSummitButton
          elevation={elevation}
          isLocked={elevationLocked}
          isLoading={stakePending}
          disabled={disabled || invalidDeposit || elevationForcedDisabled}
          onClick={handleStake}
        >
          DEPOSIT
        </CenteredSummitButton>
      )}
      {!isApproved && (
        <CenteredSummitButton isLoading={approvalPending} onClick={onApprove} elevation={elevation}>
          APPROVE {symbol}
        </CenteredSummitButton>
      )}
    </Flex>
  )
}

export default FarmCardUserApproveDeposit

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
import { RewardsWillBeHarvestedType, useRewardsWillBeHarvestedModal } from '../RewardsWillBeHarvestedModal'
import { useWallet } from '@binance-chain/bsc-use-wallet'

interface Props {
  pid: number
  symbol: string
  userTotem: number
  elevationLocked: boolean
  tokenBalance: BigNumber
  tokenDecimals: number
  depositFee: number
  isApproved: boolean
  elevation: Elevation
  disabled: boolean
  lpContract: Contract
  earnedReward: BigNumber
  setPending: (boolean) => void
}

const MobileHiddenText = styled(Text)`
  ${({ theme }) => theme.mediaQueries.invNav} {
    display: none;
  }
`

const CenteredSummitButton = styled(SummitButton)`
  margin: 34px auto 24px auto;
`

const FarmCardUserApproveDeposit: React.FC<Props> = ({
  pid,
  symbol,
  elevationLocked,
  userTotem,
  tokenBalance,
  tokenDecimals,
  depositFee,
  isApproved,
  elevation,
  disabled,
  earnedReward,
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
  const { onApprove, pending: approvalPending } = useApprove(elevation, lpContract, symbol)

  // REWARDS WILL BE HARVESTED MODAL
  const presentRewardsWillBeHarvestedModal = useRewardsWillBeHarvestedModal(elevation, earnedReward, 'Deposit', RewardsWillBeHarvestedType.Farm)

  // DEPOSIT ACTION
  const { onStake, pending: stakePending } = useStake(elevation, pid)

  useEffect(() => {
    setPending(stakePending || approvalPending)
  }, [stakePending, approvalPending, setPending])

  // DEPOSIT TOKEN INPUT
  const [depositVal, setDepositVal] = useState('')
  const [invalidDeposit, setInvalidDepositVal] = useState(false)
  const fullDepositBalance = useMemo(() => {
    return getFullDisplayBalance(tokenBalance || new BigNumber(0), tokenDecimals)
  }, [tokenBalance, tokenDecimals])

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
      presentRewardsWillBeHarvestedModal({
        transactionToConfirm: () => onStake(symbol, depositVal, '0', userTotem, tokenDecimals)
      })
    },
    [
      symbol,
      depositVal,
      userTotem,
      tokenDecimals,
      onStake,
      presentRewardsWillBeHarvestedModal,
    ]
  )

  return (
    <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
      <MobileHiddenText fontSize="14px" mb="20px">
        Deposit:
      </MobileHiddenText>
      <TokenInput
        elevation={elevation}
        value={depositVal}
        balanceText="Wallet"
        disabled={disabled}
        onSelectMax={handleSelectMaxDeposit}
        onChange={handleChangeDeposit}
        max={fullDepositBalance}
        symbol={symbol}
        depositFee={depositFee}
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

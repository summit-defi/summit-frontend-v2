import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, Text } from 'uikit'
import { Elevation } from 'config/constants/types'
import { getFullDisplayBalance } from 'utils'
import SummitButton from 'uikit/components/Button/SummitButton'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import TokenInput from 'components/TokenInput'
import useStake from 'hooks/useStake'
import { isNumber } from 'lodash'
import { useRewardsWillBeClaimedModal, RewardsWillBeClaimedType } from '../../../../components/RewardsWillBeClaimedModal'

interface Props {
  farmToken: string
  symbol: string
  elevationLocked: boolean
  walletBalance: BigNumber
  decimals: number
  depositFeeBP: number
  elevation: Elevation
  disabled: boolean
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

const FarmCardUserDeposit: React.FC<Props> = ({
  farmToken,
  symbol,
  elevationLocked,
  walletBalance,
  decimals,
  depositFeeBP,
  elevation,
  disabled,
  claimable,
  setPending,
}) => {

  // REWARDS WILL BE CLAIMED MODAL
  const presentRewardsWillBeClaimedModal = useRewardsWillBeClaimedModal(elevation, claimable, 'Deposit', RewardsWillBeClaimedType.Farm)

  // DEPOSIT ACTION
  const { onStake, pending: stakePending } = useStake(farmToken, elevation)

  useEffect(() => {
    setPending(stakePending)
  }, [stakePending, setPending])

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
        summitPalette={elevation}
        value={depositVal}
        balanceText="Wallet"
        disabled={disabled}
        isLocked={elevationLocked}
        onSelectMax={handleSelectMaxDeposit}
        onChange={handleChangeDeposit}
        max={fullDepositBalance}
        symbol={symbol}
        feeText='Deposit Fee'
        feeBP={depositFeeBP}
      />
      <CenteredSummitButton
        summitPalette={elevation}
        isLocked={elevationLocked}
        isLoading={stakePending}
        disabled={disabled || invalidDeposit}
        onClick={handleStake}
      >
        DEPOSIT
      </CenteredSummitButton>
    </Flex>
  )
}

export default React.memo(FarmCardUserDeposit)

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, Text } from 'uikit'
import { Elevation } from 'config/constants/types'
import { getFullDisplayBalance } from 'utils'
import SummitButton from 'uikit/components/Button/SummitButton'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import TokenInput from 'components/TokenInput'
import useWithdraw from 'hooks/useWithdraw'
import { isNumber } from 'lodash'
import { useRewardsWillBeClaimedModal, RewardsWillBeClaimedType } from '../RewardsWillBeClaimedModal'

interface Props {
  farmToken: string
  elevation: Elevation
  symbol: string
  elevationLocked: boolean
  stakedBalance: BigNumber
  decimals: number
  claimable: BigNumber
  withdrawalFee: number
  disabled: boolean
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

const FarmCardUserWithdraw: React.FC<Props> = ({
  farmToken,
  elevation,
  symbol,
  elevationLocked,
  stakedBalance,
  decimals,
  withdrawalFee,
  claimable,
  disabled,
  setPending,
}) => {
  // WITHDRAW ACTION
  const { onWithdraw, pending: withdrawPending } = useWithdraw(farmToken, elevation)


  // REWARDS WILL BE CLAIMED MODAL
  const presentRewardsWillBeClaimedModal = useRewardsWillBeClaimedModal(elevation, claimable, 'Withdraw', RewardsWillBeClaimedType.Farm)


  useEffect(() => {
    setPending(withdrawPending)
  }, [withdrawPending, setPending])

  // WITHDRAWAL TOKEN INPUT
  const [withdrawVal, setWithdrawVal] = useState('')
  const [invalidWithdraw, setInvalidWithdrawVal] = useState(false)
  const fullWithdrawBalance = useMemo(() => {
    return getFullDisplayBalance(stakedBalance || new BigNumber(0), decimals)
  }, [stakedBalance, decimals])

  const validWithdrawVal = (testVal, stakedBal) => {
    return (
      testVal === '' ||
      (isNumber(parseFloat(testVal)) && parseFloat(testVal) >= 0 && parseFloat(testVal) <= parseFloat(stakedBal))
    )
  }
  const handleChangeWithdraw = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setWithdrawVal(e.currentTarget.value)
      setInvalidWithdrawVal(!validWithdrawVal(e.currentTarget.value, fullWithdrawBalance))
    },
    [setWithdrawVal, fullWithdrawBalance, setInvalidWithdrawVal],
  )

  const handleSelectMaxWithdraw = useCallback(() => {
    setWithdrawVal(fullWithdrawBalance)
    setInvalidWithdrawVal(!validWithdrawVal(fullWithdrawBalance, fullWithdrawBalance))
  }, [fullWithdrawBalance, setWithdrawVal, setInvalidWithdrawVal])

  const handleWithdraw = useCallback(() => {
    presentRewardsWillBeClaimedModal({
      transactionToConfirm: () => onWithdraw(symbol, withdrawVal, decimals)
    })
  }, [symbol, withdrawVal, onWithdraw, presentRewardsWillBeClaimedModal, decimals])

  return (
    <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
      <MobileHiddenText fontSize="14px" mb="20px">
        Withdraw:
      </MobileHiddenText>
      <TokenInput
        elevation={elevation}
        value={withdrawVal}
        balanceText="Deposited"
        disabled={disabled}
        onSelectMax={handleSelectMaxWithdraw}
        onChange={handleChangeWithdraw}
        max={fullWithdrawBalance}
        symbol={symbol}
        withdrawalFee={withdrawalFee}
      />
      <CenteredSummitButton
        elevation={elevation}
        isLocked={elevationLocked}
        isLoading={withdrawPending}
        disabled={invalidWithdraw || disabled}
        onClick={handleWithdraw}
      >
        WITHDRAW
      </CenteredSummitButton>
    </Flex>
  )
}

export default FarmCardUserWithdraw

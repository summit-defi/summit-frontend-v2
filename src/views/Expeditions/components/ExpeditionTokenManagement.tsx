import React, { useCallback, useMemo, useState } from 'react'
import { Flex, useModal, Text } from 'uikit'
import { Elevation, ForceElevationRetired } from 'config/constants/types'
import { getFullDisplayBalance } from 'utils'
import SummitButton from 'uikit/components/Button/SummitButton'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import TokenInput from 'components/TokenInput'
import useStake from 'hooks/useStake'
import { useApprove } from 'hooks/useApprove'
import { isNumber } from 'lodash'
import { useSummitLp, useSummitToken } from 'hooks/useContract'
import { getSummitLpSymbol } from 'config/constants'
import useWithdraw from 'hooks/useWithdraw'
import useElevate from 'hooks/useElevate'
import ElevateModal from 'views/ElevationFarms/components/ElevateModal'
import ElevationSelector from 'views/ElevationFarms/components/ElevationSelector'
import { useAvailableSisterElevations, usePendingExpeditionTx } from 'state/hooks'
import { useHistory } from 'react-router-dom'

interface Props {
  pid: number
  userDeity: number
  isSummitLp: boolean
  allowance: BigNumber
  staked: BigNumber
  balance: BigNumber
  expeditionLocked: boolean
  expired?: boolean
}

const MobileVerticalFlex = styled(Flex)<{ expired: boolean }>`
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    justify-content: ${({ expired }) => expired ? 'center' : 'space-between'};
  }
`

const CenteredSummitButton = styled(SummitButton)`
  margin: 34px auto 24px auto;
`

const ButtonText = styled(Text)`
  text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
  font-family: Courier Prime, monospace;
  line-height: 1;
  font-size: 16px;
  font-weight: 600;
`

const ExpeditionTokenManagement: React.FC<Props> = ({
  pid,
  userDeity,
  isSummitLp,
  allowance,
  staked,
  balance,
  expeditionLocked,
  expired = false,
}) => {
  // Always either SUMMIT or SUMMIT LP, which will always have 18 decimals
  // No need to pass through decimals to balance numbering
  const pendingExpeditionTx = usePendingExpeditionTx()

  const summitTokenContract = useSummitToken()
  const summitLpContract = useSummitLp()
  const lpContract = isSummitLp ? summitLpContract : summitTokenContract
  const trueTokenAddress = lpContract.options.address
  const symbol = isSummitLp ? getSummitLpSymbol() : 'SUMMIT'

  const isApproved = allowance && allowance.isGreaterThan(0)

  // APPROVE ACTION
  const { onApprove, pending: approvalPending } = useApprove(Elevation.EXPEDITION, lpContract, symbol)

  // DEPOSIT ACTION
  const { onStake, pending: stakePending } = useStake(Elevation.EXPEDITION, pid)

  // WITHDRAW ACTION
  const { onWithdraw, pending: withdrawPending } = useWithdraw(Elevation.EXPEDITION, pid)

  // DEPOSIT TOKEN INPUT
  const [depositVal, setDepositVal] = useState('')
  const [invalidDeposit, setInvalidDepositVal] = useState(false)
  const fullDepositBalance = useMemo(() => {
    return getFullDisplayBalance(balance || new BigNumber(0), 18)
  }, [balance])

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

  const handleStake = useCallback(
    () => onStake(symbol, isSummitLp ? '0' : depositVal, isSummitLp ? depositVal : '0', userDeity, 18),
    [symbol, isSummitLp, depositVal, userDeity, onStake],
  )

  // WITHDRAWAL TOKEN INPUT
  const [withdrawVal, setWithdrawVal] = useState('')
  const [invalidWithdraw, setInvalidWithdrawVal] = useState(false)
  const fullWithdrawBalance = useMemo(() => {
    return getFullDisplayBalance(staked || new BigNumber(0))
  }, [staked])

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

  const handleWithdraw = useCallback(
    () => onWithdraw(symbol, isSummitLp ? '0' : withdrawVal, isSummitLp ? withdrawVal : '0', 18),
    [symbol, isSummitLp, withdrawVal, onWithdraw],
  )

  // ELEVATE
  const availableSisterElevations = useAvailableSisterElevations(symbol, pid)
  const { onElevate } = useElevate()

  const history = useHistory()
  const openExpeditionPage = () => {
    history.push('/expedition')
  }

  const [onPresentElevate] = useModal(
    <ElevateModal
      symbol={symbol}
      tokenAddress={trueTokenAddress}
      forcedExpeditionPid={pid}
      onConfirmElevate={onElevate}
      openExpeditionPage={openExpeditionPage}
    />,
  )
  const handleSelectElevation = (selectedElevation) => {
    onPresentElevate({
      sourceElevation: selectedElevation === Elevation.EXPEDITION ? undefined : Elevation.EXPEDITION,
      targetElevation: selectedElevation,
    })
  }

  const elevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT, Elevation.EXPEDITION]
  const disabledElevations = elevations.filter((elevToDisable) => !availableSisterElevations[elevToDisable] || (ForceElevationRetired && [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT].includes(elevToDisable)))

  return (
    <MobileVerticalFlex expired={expired}>
      {/* DEPOSIT */}
      { !expired &&
        <Flex flexDirection="column">
          <TokenInput
            elevation={Elevation.EXPEDITION}
            value={depositVal}
            balanceText="Wallet"
            onSelectMax={handleSelectMaxDeposit}
            onChange={handleChangeDeposit}
            max={fullDepositBalance}
            disabled={!isApproved || pendingExpeditionTx}
            symbol={symbol}
          />
          {isApproved && (
            <CenteredSummitButton
              elevation={Elevation.EXPEDITION}
              isLocked={expeditionLocked}
              isLoading={stakePending}
              disabled={invalidDeposit || withdrawPending || pendingExpeditionTx}
              onClick={handleStake}
            >
              DEPOSIT
            </CenteredSummitButton>
          )}
          {!isApproved && (
            <CenteredSummitButton isLoading={approvalPending} onClick={onApprove} elevation={Elevation.EXPEDITION}>
              APPROVE {symbol}
            </CenteredSummitButton>
          )}
        </Flex>
      }

      {/* WITHDRAW */}
      <Flex flexDirection="column">
        <TokenInput
          elevation={Elevation.EXPEDITION}
          value={withdrawVal}
          balanceText="Deposited"
          onSelectMax={handleSelectMaxWithdraw}
          onChange={handleChangeWithdraw}
          max={fullWithdrawBalance}
          symbol={symbol}
          disabled={!isApproved || isSummitLp || pendingExpeditionTx}
        />
        <CenteredSummitButton
          elevation={Elevation.EXPEDITION}
          isLocked={expeditionLocked}
          isLoading={withdrawPending}
          disabled={invalidWithdraw || stakePending || !isApproved || isSummitLp || pendingExpeditionTx}
          onClick={handleWithdraw}
        >
          { isSummitLp ?
            <ButtonText>
              <ButtonText style={{textDecoration: 'line-through'}}>WITHDRAW</ButtonText>
              <ButtonText>USE ELEVATE INSTEAD</ButtonText>
            </ButtonText>:
            'WITHDRAW'
          }
        </CenteredSummitButton>
      </Flex>

      {/* ELEVATE */}
      <Flex flexDirection="column" mb='24px'>
        <Text fontSize="14px" mb="8px" bold italic>
          Elevate
        </Text>
        <ElevationSelector
          selected={Elevation.EXPEDITION}
          desktopOnlyVertical
          isLocked={expeditionLocked}
          elevations={elevations}
          disabledElevations={disabledElevations}
          disabled={stakePending || withdrawPending || !isApproved || pendingExpeditionTx}
          selectElevation={handleSelectElevation}
        />
      </Flex>
    </MobileVerticalFlex>
  )
}

export default ExpeditionTokenManagement

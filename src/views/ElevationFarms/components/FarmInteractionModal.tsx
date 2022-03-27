import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, Text, Modal, ChevronRightIcon, ModalActions, SummitButton, MobileColumnFlex } from 'uikit'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { Elevation, elevToPalette } from 'config/constants/types'
import ElevationSelector from './ElevationSelector'
import { isNumber } from 'lodash'
import Totem from './Totem'
import { elevationPalette } from 'theme/colors'
import { useSelectTotemModal } from 'components/SelectTotemModal'
import { useElevationUserTotem, useFarmUserTokenFairnessTaxBP, useSymbolElevateModalInfo } from 'state/hooksNew'
import { useWeb3React } from '@web3-react/core'
import FarmInteractionTypeSelector, { FarmInteractionType } from './FarmCard/FarmInteractionTypeSelector'
import styled from 'styled-components'
import { WalletIcon } from 'uikit/widgets/Menu/icons'
import { useApprove } from 'hooks/useApprove'
import useElevate from 'hooks/useElevate'
import useStake from 'hooks/useStake'
import useWithdraw from 'hooks/useWithdraw'
import { mix } from 'polished'
import DesktopVerticalDivider from 'uikit/components/DesktopVerticalDivider'

const WalletIconWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.selectorBackground};
  width: 140px;
  height: 116px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ElevInfoSection = styled.div<{ elevation?: Elevation }>`
  display: flex;
  flex: 1;
  flex-basis: 360px 100px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ theme, elevation }) => elevation ?
    mix(0.85, theme.colors.background, theme.colors[elevation]) :
    theme.colors.cardHover
  };
`

const StyledWalletIcon = styled(WalletIcon)`
  width: 32px;
  height: 32px;
`

const BaseElevFlare = styled.div<{ elevation: Elevation }>`
  display: flex;
  position: absolute;
  bottom: -38px;
  height: 50px;
  background-color: ${({ theme, elevation }) => theme.colors[elevation]};
  left: 0px;
  right: 0px;
  opacity: 0.15;
  z-index: -1;

  &:after {
      content: ' ';
      border: 0;
      position: absolute;
      width: 20px;
      bottom: 20px;
      top: 0px;
      border-radius: 0 0 20px 20px;
      background: ${({ theme }) => theme.colors.background};
  }
`
const TargetElevFlare = styled(BaseElevFlare)`
  left: -20px;

  &:after {
      left: 0px;
      border-radius: 0 0 20px 0;
  }
`
const SourceElevFlare = styled(BaseElevFlare)`
  right: -20px;

  &:after {
      right: 0px;
      border-radius: 0 0 0 20px;
  }
`

interface FarmInteractionModalProps {
  symbol: string
  onDismiss?: () => void
}

const FarmInteractionModal: React.FC<FarmInteractionModalProps> = ({
  symbol,
  onDismiss,
}) => {
  const { account } = useWeb3React()
  const {
    elevLaunched,
    elevStaked,
    decimals,
    farmToken,
    depositFeeBP,

    farmAllowance,
    walletBalance,
  } = useSymbolElevateModalInfo(symbol)
  const userFairnessTaxBP = useFarmUserTokenFairnessTaxBP(symbol)
  
  const { onApprove, pending: approvalPending } = useApprove(farmToken, symbol)
  const { onStake, pending: stakePending } = useStake()
  const { onWithdraw, pending: withdrawPending } = useWithdraw()
  const { onElevate, pending: elevatePending} = useElevate()

  const isApproved = account && farmAllowance && farmAllowance.isGreaterThan(0)
  const [farmInteractionType, setFarmInteractionType] = useState(FarmInteractionType.Deposit)

  const interactionTypeDescription = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return `Select an Elevation and Amount of ${symbol} to Deposit.`
          return `Approve ${symbol} to Stake it in our Farms`
        case FarmInteractionType.Elevate: return `Transfer ${symbol} directly between Elevations (no Deposit or Withdrawal Fee)`
        case FarmInteractionType.Withdraw: return `Select an elevation and Withdraw your ${symbol}`
        default: return ''
      }
    },
    [isApproved, symbol, farmInteractionType]
  )
  
  const interactionTypeText = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return 'Deposit'
          return 'Approve'
        case FarmInteractionType.Elevate: return `Elevate`
        case FarmInteractionType.Withdraw: return `Withdraw`
        default: return ''
      }
    },
    [isApproved, farmInteractionType]
  )


  const sisterElevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT]
  const disabledElevations = sisterElevations.filter((elevToDisable) => !elevLaunched[elevToDisable])

  const sourceElevations = sisterElevations
  const targetElevations = sisterElevations

  const [selectedSourceElevation, setSelectedSourceElevation] = useState<Elevation | null>(null)
  const [selectedTargetElevation, setSelectedTargetElevation] = useState<Elevation | null>(null)
  const uiElevation = selectedTargetElevation ?? selectedSourceElevation

  const handleSetFarmInteractionType = useCallback(
    (type: FarmInteractionType) => {
      setFarmInteractionType(type)
      if (type === FarmInteractionType.Deposit) setSelectedSourceElevation(null)
      if (type === FarmInteractionType.Withdraw) setSelectedTargetElevation(null)
    },
    [setFarmInteractionType, setSelectedSourceElevation, setSelectedTargetElevation]
  )

  const uiPalette = elevToPalette(uiElevation)
  const totem = useElevationUserTotem(selectedTargetElevation)
  const { onPresentSelectTotemModal } = useSelectTotemModal(selectedTargetElevation)

  const [fullBalance, setFullBalance] = useState('0')
  const [val, setVal] = useState('')
  const [invalidVal, setValInvalid] = useState(true)

  const validElevateVal = (testVal, stakedBal) => {
    return isNumber(parseFloat(testVal)) && parseFloat(testVal) > 0 && parseFloat(testVal) <= parseFloat(stakedBal)
  }

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      setValInvalid(!validElevateVal(e.currentTarget.value, fullBalance))
    },
    [setVal, setValInvalid, fullBalance],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
    setValInvalid(!validElevateVal(fullBalance, fullBalance))
  }, [fullBalance, setVal, setValInvalid])

  const handleSelectSourceElevation = useCallback(
    (newElevation: Elevation) => {
      setSelectedSourceElevation(newElevation)
    },
    [setSelectedSourceElevation],
  )

  useEffect(
    () => {
      let newFullBalance
      if (farmInteractionType === FarmInteractionType.Deposit) {
        // Deposit Full balance is wallet balance
        newFullBalance = getFullDisplayBalance(
          walletBalance,
          decimals,
        )
      } else if (selectedSourceElevation === null) {
        return
      } else {
        // Elevate / Withdraw full balance is Elevation Balance (only if source elev selected)
        newFullBalance = getFullDisplayBalance(
          elevStaked[selectedSourceElevation],
          decimals,
        )
      }

      setFullBalance(newFullBalance)
      setValInvalid(!validElevateVal(newFullBalance, newFullBalance))
      setVal(newFullBalance)
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletBalance, selectedSourceElevation]
  )

  const handleSelectTargetElevation = useCallback(
    (newElevation: Elevation) => {
      setSelectedTargetElevation(newElevation)
    },
    [setSelectedTargetElevation],
  )

  const handlePresentSelectTotem = () => {
    onPresentSelectTotemModal()
  }


  const [tokenInputFeeText, tokenInputFeeBP] = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return [`Deposit Fee (${(depositFeeBP / 100).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}%)`, depositFeeBP]
          return [null, null]
        case FarmInteractionType.Elevate: return [null, null]
        case FarmInteractionType.Withdraw: return [`Decaying Withdrawal Fee (${(userFairnessTaxBP / 100).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
      })}%)`, userFairnessTaxBP]
        default: return [null, null]
      }
    },
    [isApproved, farmInteractionType, depositFeeBP, userFairnessTaxBP]
  )


  const invalidElevationErr = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return selectedTargetElevation == null ? 'Must select an Elevation to Deposit into' : null
          return null
        case FarmInteractionType.Elevate:
          if (selectedTargetElevation == null && selectedSourceElevation == null) return 'Select Elevations to transfer funds between'  
          if (selectedSourceElevation == null) return 'Must select a source Elevation'
          if (selectedTargetElevation == null) return 'Must select a target Elevation'
          if (selectedSourceElevation === selectedTargetElevation) return 'Must Elevate between two different Elevations'
          return null
        case FarmInteractionType.Withdraw:
          return selectedSourceElevation == null ? ' Must select an Elevation to Withdraw from' : null
        default: return false
      }
    },
    [isApproved, farmInteractionType, selectedSourceElevation, selectedTargetElevation]
  )

  // ACTION


  const actionDisabled = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return totem == null || invalidVal || selectedTargetElevation == null
          return false
        case FarmInteractionType.Elevate: return invalidElevationErr != null || totem == null || invalidVal || selectedSourceElevation == null || selectedTargetElevation == null
        case FarmInteractionType.Withdraw: return invalidVal || selectedSourceElevation == null
        default: return false
      }
    },
    [isApproved, farmInteractionType, invalidElevationErr, totem, invalidVal, selectedTargetElevation, selectedSourceElevation]
  )
  const handleAction = useCallback(
    () => {
      if (actionDisabled) return
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) {
            onStake(
              symbol,
              farmToken,
              selectedTargetElevation,
              val,
              decimals,
              onDismiss
            )
            break
          }
          onApprove()
          break
        case FarmInteractionType.Elevate:
          onElevate(
            symbol,
            farmToken,
            selectedSourceElevation,
            selectedTargetElevation,
            val,
            decimals,
            onDismiss
          )
          break
        case FarmInteractionType.Withdraw:
          onWithdraw(
            symbol,
            farmToken,
            selectedSourceElevation,
            val,
            decimals,
            onDismiss
          )
          break
        default: break
      }
    },
    [onDismiss, isApproved, farmInteractionType, symbol, farmToken, selectedTargetElevation, selectedSourceElevation, val, decimals, actionDisabled, onStake, onApprove, onWithdraw, onElevate]
  )

  return (
    <Modal
      title={`${interactionTypeText}|br|${symbol}`}
      onDismiss={onDismiss}
      elevationCircleHeader={uiElevation || 'BLUE'}
      headerless
    >
      <Flex justifyContent="center" flexDirection="column" alignItems="center" gap='18px' mt='12px'>

        <FarmInteractionTypeSelector
          isApproved={isApproved}
          elevation={uiElevation}
          farmInteractionType={farmInteractionType}
          setFarmInteractionType={handleSetFarmInteractionType}
        />


        <Text textAlign="center" monospace small bold>
          {interactionTypeDescription}
        </Text>


        <MobileColumnFlex gap='24px' alignItems='flex-start' justifyContent='space-between'>

          <Flex width='360px' maxWidth='100%' justifyContent="center" flexDirection="column" alignItems="center" gap='18px'>

            { isApproved &&
              <Flex justifyContent="space-between" alignItems="center" width="100%">
                <Flex position='relative' flexDirection="column" alignItems="center">
                  <Text bold monospace small>
                    FROM:
                  </Text>
                  { farmInteractionType === FarmInteractionType.Deposit ?
                    <WalletIconWrapper>
                      <StyledWalletIcon/>
                      <Text bold monospace>WALLET</Text>
                    </WalletIconWrapper> :
                    <ElevationSelector
                      selected={selectedSourceElevation}
                      elevations={sourceElevations}
                      disabledElevations={disabledElevations}
                      selectElevation={handleSelectSourceElevation}
                      vertical
                    />
                  }
                  { (farmInteractionType === FarmInteractionType.Withdraw && selectedSourceElevation != null) &&
                    <SourceElevFlare elevation={selectedSourceElevation}/>
                  }
                </Flex>

                <Flex mt='24px'>
                  <ChevronRightIcon width="24px" mr="-8px" key="a" />
                  <ChevronRightIcon width="24px" ml="-8px" key="b" />
                </Flex>

                <Flex position='relative' flexDirection="column" alignItems="center">
                  <Text bold monospace small>
                    TO:
                  </Text>
                  { farmInteractionType === FarmInteractionType.Withdraw ?
                    <WalletIconWrapper>
                      <StyledWalletIcon/>
                      <Text bold monospace>WALLET</Text>
                    </WalletIconWrapper> :
                    <ElevationSelector
                      selected={selectedTargetElevation}
                      elevations={targetElevations}
                      disabledElevations={disabledElevations}
                      selectElevation={handleSelectTargetElevation}
                      vertical
                    />
                  }
                  { selectedTargetElevation != null && <TargetElevFlare elevation={selectedTargetElevation}/>}
                </Flex>
              </Flex>
            }


            { isApproved &&
            <ElevInfoSection elevation={uiElevation}>
              {uiElevation != null &&
              <Flex width='33%' flexDirection='column' alignItems='center' justifyContent='center'>
                <Text bold monospace small>
                  TOTEM:
                </Text>
                {(totem == null) ? (
                  <Flex height='56px' alignItems='center' justifyContent='center' flexDirection='column'>
                    <SummitButton width='112px' summitPalette={uiElevation} onClick={handlePresentSelectTotem}>
                      SELECT
                      <br/>
                      TOTEM
                    </SummitButton>
                  </Flex>
                ) : (
                  <Totem
                    elevation={uiElevation}
                    totem={totem}
                    color={elevationPalette[uiElevation][2]}
                    selected
                    pressable={false}
                    size='40'
                    navSize='40'
                  />
                )}
              </Flex>
              }
              <Flex width='33%' flexDirection='column' alignItems='center' justifyContent='center'>
                <Text bold monospace small>
                  {uiElevation ?? 'BASE'} APY:
                </Text>
                <Flex height='56px' alignItems='center' justifyContent='center' flexDirection='column'>
                  { uiElevation == null &&
                    <Text bold monospace fontSize='11px' mb='-6px'>
                      UP TO
                    </Text>
                  }
                  <Text bold monospace>
                    500%
                  </Text>
                  <Text bold monospace fontSize='11px'>
                    DAILY APR
                  </Text>
                  <Text bold monospace fontSize='12px' mt='-6px'>
                    500%
                  </Text>
                </Flex>
              </Flex>
              <Flex width='33%' flexDirection='column' alignItems='center' justifyContent='center'>
                <Text bold monospace small>
                {uiElevation ?? 'TOTAL'} TVL:
                </Text>
                <Flex height='56px' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Text bold monospace>
                    $600,000
                  </Text>
                </Flex>
              </Flex>
            </ElevInfoSection>
            }



            { invalidElevationErr != null &&
              <Text bold monospace small textAlign='center' color='red'>
                {invalidElevationErr}
              </Text>
            }
          </Flex>


          <DesktopVerticalDivider/>


          <Flex width='360px' maxWidth='100%' justifyContent="center" flexDirection="column" alignItems="center" gap='18px'>

            { isApproved &&
              <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                <Text bold monospace small>
                {interactionTypeText.toUpperCase()} AMOUNT:
                </Text>
                <TokenInput
                  summitPalette={uiPalette}
                  balanceText={`${selectedSourceElevation ?? 'WALLET'} BALANCE`}
                  feeText={tokenInputFeeText}
                  feeBP={tokenInputFeeBP}
                  value={val}
                  onSelectMax={handleSelectMax}
                  onChange={handleChange}
                  disabled={totem == null}
                  max={fullBalance}
                  symbol={symbol}
                />
              </Flex>
            }

            <ModalActions>
              <SummitButton summitPalette={uiPalette} secondary onClick={onDismiss}>
                CANCEL
              </SummitButton>
              <SummitButton
                summitPalette={uiPalette}
                disabled={actionDisabled}
                isLoading={approvalPending || stakePending || withdrawPending || elevatePending}
                onClick={handleAction}
              >
                {interactionTypeText.toUpperCase()}
              </SummitButton>
            </ModalActions>
          </Flex>
        </MobileColumnFlex>
      </Flex>
    </Modal>
  )
}

export default FarmInteractionModal

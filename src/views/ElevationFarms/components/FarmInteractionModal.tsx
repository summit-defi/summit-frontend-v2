import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, Text, Modal, ChevronRightIcon, ModalActions, SummitButton } from 'uikit'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { Elevation, elevToPalette } from 'config/constants/types'
import ElevationSelector from './ElevationSelector'
import { isNumber } from 'lodash'
import Totem from './Totem'
import { elevationPalette } from 'theme/colors'
import { useSelectTotemModal } from 'components/SelectTotemModal'
import { useElevationUserTotem, useSymbolElevateModalInfo } from 'state/hooksNew'
import { useWeb3React } from '@web3-react/core'
import FarmInteractionTypeSelector, { FarmInteractionType } from './FarmCard/FarmInteractionTypeSelector'
import styled from 'styled-components'
import { WalletIcon } from 'uikit/widgets/Menu/icons'

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

const StyledWalletIcon = styled(WalletIcon)`
  width: 32px;
  height: 32px;
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

    farmAllowance,
    walletBalance,
  } = useSymbolElevateModalInfo(symbol)

  const isApproved = account && farmAllowance && farmAllowance.isGreaterThan(0)
  const [farmInteractionType, setFarmInteractionType] = useState(FarmInteractionType.Deposit)

  const interactionTypeDescription = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return `Select an elevation and amount of ${symbol} to Deposit.`
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
  const [invalidElevationErr, setInvalidElevationErr] = useState<string | null>(null)
  const uiElevation = selectedTargetElevation ?? selectedSourceElevation ?? Elevation.OASIS

  const handleSetFarmInteractionType = useCallback(
    (type: FarmInteractionType) => {
      setFarmInteractionType(type)
      setInvalidElevationErr(null)
      if (type === FarmInteractionType.Deposit) setSelectedSourceElevation(null)
      if (type === FarmInteractionType.Withdraw) setSelectedTargetElevation(null)
    },
    [setFarmInteractionType, setInvalidElevationErr, setSelectedSourceElevation, setSelectedTargetElevation]
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
      setInvalidElevationErr(newElevation === selectedTargetElevation ? 'Elevations must be different' : null)
    },
    [setSelectedSourceElevation, setInvalidElevationErr, selectedTargetElevation],
  )

  useEffect(
    () => {
      if (selectedSourceElevation === null) return

      const newFullBalance = getFullDisplayBalance(
        elevStaked[selectedSourceElevation],
        decimals,
      )
      setFullBalance(newFullBalance)
      setVal(newFullBalance)
      setValInvalid(!validElevateVal(newFullBalance, newFullBalance))
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSourceElevation]
  )

  const handleSelectTargetElevation = useCallback(
    (newElevation: Elevation) => {
      setSelectedTargetElevation(newElevation)
      setInvalidElevationErr(newElevation === selectedSourceElevation ? 'Elevations must be different' : null)
    },
    [setSelectedTargetElevation, setInvalidElevationErr, selectedSourceElevation],
  )

  const handlePresentSelectTotem = () => {
    onPresentSelectTotemModal()
  }

  // CONFIRM ELEVATE
  const handleConfirmElevate = useCallback(() => {
    onDismiss()
    // TODO: Elevate
  }, [onDismiss])


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

  return (
    <Modal
      title={`${interactionTypeText}|br|${symbol}`}
      onDismiss={onDismiss}
      elevationCircleHeader={uiElevation}
      headerless
    >
      <Flex maxWidth='360px' justifyContent="center" flexDirection="column" alignItems="center" gap='18px'>

        <FarmInteractionTypeSelector
          isApproved={isApproved}
          elevation={uiElevation}
          farmInteractionType={farmInteractionType}
          setFarmInteractionType={handleSetFarmInteractionType}
        />


        <Text textAlign="center" monospace small bold>
          {interactionTypeDescription}
        </Text>

        { isApproved &&
          <Flex justifyContent="space-around" alignItems="center" width="100%">
            <Flex flexDirection="column" alignItems="center">
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
            </Flex>

            <Flex mt='24px'>
              <ChevronRightIcon width="24px" mr="-8px" key="a" />
              <ChevronRightIcon width="24px" ml="-8px" key="b" />
            </Flex>

            <Flex flexDirection="column" alignItems="center">
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
            </Flex>
          </Flex>
        }

        { invalidElevationErr != null &&
          <Text bold monospace textAlign='center' color='red'>
            {invalidElevationErr}
          </Text>
        }

        { isApproved && selectedTargetElevation != null &&
        <Flex flexDirection='column' alignItems='center' justifyContent='center' gap='8px'>
          <Text bold monospace small>
            {selectedTargetElevation} TOTEM:
          </Text>
          {totem == null ? (
            <SummitButton summitPalette={selectedTargetElevation} onClick={handlePresentSelectTotem}>
              SELECT TOTEM
            </SummitButton>
          ) : (
            <Totem
              elevation={selectedTargetElevation}
              totem={totem}
              color={elevationPalette[selectedTargetElevation][2]}
              selected
              pressable={false}
            />
          )}
        </Flex>
        }

        { isApproved &&
          <Flex flexDirection='column' alignItems='center' justifyContent='center'>
            <Text bold monospace small>
              AMOUNT TO {interactionTypeText.toUpperCase()}:
            </Text>
            <TokenInput
              summitPalette={uiPalette}
              value={val}
              onSelectMax={handleSelectMax}
              onChange={handleChange}
              disabled={totem == null}
              max={fullBalance}
              symbol={symbol}
            />
          </Flex>
        }
      </Flex>

      <ModalActions>
        <SummitButton summitPalette={uiPalette} secondary onClick={onDismiss}>
          CANCEL
        </SummitButton>
        <SummitButton
          summitPalette={uiPalette}
          disabled={actionDisabled}
          onClick={handleConfirmElevate}
        >
          {interactionTypeText.toUpperCase()}
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

export default FarmInteractionModal

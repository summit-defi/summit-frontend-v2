import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text, Modal, ChevronRightIcon, ModalActions, SummitButton } from 'uikit'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { Elevation, elevToPalette } from 'config/constants/types'
import ElevationSelector from './ElevationSelector'
import { isNumber } from 'lodash'
import Totem from './Totem'
import { elevationPalette } from 'theme/colors'
import { useRewardsWillBeClaimedModal, RewardsWillBeClaimedType } from 'components/RewardsWillBeClaimedModal'
import { useSelectTotemModal } from 'components/SelectTotemModal'
import { useElevationUserTotem, useSymbolElevateModalInfo } from 'state/hooksNew'

interface ElevateModalProps {
  symbol: string
  sourceElevation?: Elevation
  targetElevation?: Elevation

  onConfirmElevate: (
    symbol: string,
    token: string,
    sourceElevation: Elevation,
    targetElevation: Elevation,
    amount: string,
    decimals: number,
  ) => void
  onDismiss?: () => void
}

const ElevateModal: React.FC<ElevateModalProps> = ({
  symbol,
  sourceElevation = null,
  targetElevation = null,
  onConfirmElevate,
  onDismiss,
}) => {
  const {
    elevLaunched,
    elevClaimable,
    elevStaked,
    decimals,
    farmToken,
  } = useSymbolElevateModalInfo(symbol)

  // REWARDS WILL BE FROZEN MODAL
  const presentRewardsWillBeClaimedModal = useRewardsWillBeClaimedModal(Elevation.OASIS, new BigNumber(0), 'Elevate', RewardsWillBeClaimedType.Elevate)
  
  const sisterElevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT]
  const disabledElevations = sisterElevations.filter((elevToDisable) => !elevLaunched[elevToDisable])

  const sourceElevations =
    sourceElevation != null ? [sourceElevation] : sisterElevations.filter((elev) => elev !== targetElevation)
  const targetElevations =
    targetElevation != null ? [targetElevation] : sisterElevations.filter((elev) => elev !== sourceElevation)

  const [selectedSourceElevation, setSelectedSourceElevation] = useState(sourceElevation || null)
  const [selectedTargetElevation, setSelectedTargetElevation] = useState(targetElevation || null)
  const targetElevationPalette = elevToPalette(selectedTargetElevation)
  const totem = useElevationUserTotem(selectedTargetElevation)
  const { onPresentSelectTotemModal } = useSelectTotemModal(selectedTargetElevation)

  const [sourceClaimable, setSourceClaimable] = useState(null)
  const [targetClaimable, setTargetClaimable] = useState(null)
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
    (newElevation: Elevation) => setSelectedSourceElevation(newElevation),
    [setSelectedSourceElevation],
  )

  useEffect(() => {
    if (selectedSourceElevation === null) return
    
    setSourceClaimable(elevClaimable[selectedSourceElevation])
    const newFullBalance = getFullDisplayBalance(
      elevStaked[selectedSourceElevation],
      decimals,
    )
    setFullBalance(newFullBalance)
    setVal(newFullBalance)
    setValInvalid(!validElevateVal(newFullBalance, newFullBalance))
  }, [
    decimals,
    selectedSourceElevation,
    symbol,
    setFullBalance,
    setSourceClaimable,
    setVal,
    setValInvalid,
    elevClaimable,
    elevStaked,
  ])

  const handleSelectTargetElevation = useCallback(
    (newElevation: Elevation) => setSelectedTargetElevation(newElevation),
    [setSelectedTargetElevation],
  )

  useEffect(() => {
    setTargetClaimable(elevClaimable[selectedTargetElevation])
  }, [selectedTargetElevation, elevClaimable, setTargetClaimable])

  const handlePresentSelectTotem = () => {
    onPresentSelectTotemModal()
  }

  // CONFIRM ELEVATE
  const handleConfirmElevate = () => {
    onDismiss()
    presentRewardsWillBeClaimedModal({
      elevateInfo: {
        sourceElevation: selectedSourceElevation,
        targetElevation: selectedTargetElevation,
        sourceClaimable,
        targetClaimable,
      },
      transactionToConfirm: () => onConfirmElevate(symbol, farmToken, selectedSourceElevation, selectedTargetElevation, val, decimals),
    })
  }

  return (
    <Modal
      title={`Elevate|br|${symbol}`}
      onDismiss={onDismiss}
      elevationCircleHeader={selectedTargetElevation}
      headerless
    >
      <Flex justifyContent="center" flexDirection="column" alignItems="center">
        <Text textAlign="center" monospace small bold>
          {`Transfer ${symbol} between elevations`}
          <br/>
          and avoid the Fairness Tax.
        </Text>

        <Flex justifyContent="space-around" alignItems="center" width="100%" mt="24px">
          <Flex flexDirection="column" alignItems="center">
            <Text bold monospace small>
              FROM THE:
            </Text>
            <ElevationSelector
              selected={selectedSourceElevation}
              elevations={sourceElevations}
              disabledElevations={disabledElevations}
              selectElevation={handleSelectSourceElevation}
              vertical
            />
          </Flex>

          <Flex mt="24px">
            <ChevronRightIcon width="24px" mr="-8px" key="a" />
            <ChevronRightIcon width="24px" ml="-8px" key="b" />
          </Flex>

          <Flex flexDirection="column" alignItems="center">
            <Text bold monospace small>
              TO THE:
            </Text>
            <ElevationSelector
              selected={selectedTargetElevation}
              elevations={targetElevations}
              disabledElevations={disabledElevations}
              selectElevation={handleSelectTargetElevation}
              vertical
            />
          </Flex>
        </Flex>

        <Text bold monospace mt="24px" small>
          {selectedTargetElevation} TOTEM:
        </Text>
        {totem == null ? (
          <SummitButton summitPalette={selectedTargetElevation} mt="11px" mb="11px" onClick={handlePresentSelectTotem}>
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

        <Text bold monospace mt="24px" mb="12px" small>
          AMOUNT TO TRANSFER:
        </Text>
        <TokenInput
          summitPalette={targetElevationPalette}
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          disabled={totem == null}
          max={fullBalance}
          symbol={symbol}
        />
      </Flex>

      <ModalActions>
        <SummitButton summitPalette={targetElevationPalette} secondary onClick={onDismiss}>
          CANCEL
        </SummitButton>
        <SummitButton
          summitPalette={targetElevationPalette}
          disabled={totem == null || invalidVal || selectedSourceElevation == null || selectedTargetElevation == null}
          onClick={handleConfirmElevate}
        >
          ELEVATE
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

export default ElevateModal

import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text, Modal, ChevronRightIcon, ModalActions, SummitButton } from 'uikit'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { Elevation, elevToPalette } from 'config/constants/types'
import ElevationSelector from './ElevationSelector'
import { useElevationTotem, useSisterFarms } from 'state/hooks'
import { isNumber } from 'lodash'
import Totem from './Totem'
import { elevationPalette } from 'theme/colors'
import { useRewardsWillBeClaimedModal, RewardsWillBeClaimedType } from 'components/RewardsWillBeClaimedModal'
import { useSelectTotemModal } from 'components/SelectTotemModal'

interface ElevateModalProps {
  symbol: string
  tokenAddress: string
  decimals: number

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
  tokenAddress,
  decimals,
  sourceElevation = null,
  targetElevation = null,
  onConfirmElevate,
  onDismiss,
}) => {
  const sisterFarms = useSisterFarms(symbol)

  // REWARDS WILL BE CLAIMED MODAL
  const presentRewardsWillBeClaimedModal = useRewardsWillBeClaimedModal(Elevation.OASIS, new BigNumber(0), 'Elevate', RewardsWillBeClaimedType.Elevate)
  
  const disabledElevations = Object.entries(sisterFarms)
    .filter(([_, sisterFarm]) => sisterFarm == null)
    .map(([sisterElevation]) => sisterElevation) as Elevation[]

  const sisterElevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT]
  const sourceElevations =
    sourceElevation != null ? [sourceElevation] : sisterElevations.filter((elev) => elev !== targetElevation)
  const targetElevations =
    targetElevation != null ? [targetElevation] : sisterElevations.filter((elev) => elev !== sourceElevation)

  const [selectedSourceElevation, setSelectedSourceElevation] = useState(sourceElevation || null)
  const [selectedTargetElevation, setSelectedTargetElevation] = useState(targetElevation || null)
  const targetElevationPalette = elevToPalette(selectedTargetElevation)
  const totem = useElevationTotem(selectedTargetElevation)
  const { onPresentSelectTotemModal } = useSelectTotemModal(selectedTargetElevation)

  const [sourceEarned, setSourceEarned] = useState(null)
  const [targetEarned, setTargetEarned] = useState(null)
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
    
    const selectedFarm = sisterFarms[selectedSourceElevation]
    setSourceEarned(selectedFarm.userData?.claimable || new BigNumber(0))
    const newFullBalance = getFullDisplayBalance(
      selectedFarm.userData?.stakedBalance || new BigNumber(0),
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
    setSourceEarned,
    setVal,
    setValInvalid,
    sisterFarms,
  ])

  const handleSelectTargetElevation = useCallback(
    (newElevation: Elevation) => setSelectedTargetElevation(newElevation),
    [setSelectedTargetElevation],
  )

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setTargetEarned(sisterFarms[selectedTargetElevation]!.userData?.claimable || new BigNumber(0))
  }, [selectedTargetElevation, sisterFarms, setTargetEarned])

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
        sourceEarned,
        targetEarned,
      },
      transactionToConfirm: () => onConfirmElevate(symbol, tokenAddress, selectedSourceElevation, selectedTargetElevation, val, decimals),
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
        <Text textAlign="center" bold>
          {`Transfer ${symbol} between elevations and skip the fees.`}
        </Text>

        <Flex justifyContent="space-around" alignItems="center" width="100%" mt="24px">
          <Flex flexDirection="column" alignItems="center">
            <Text bold monospace>
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
            <Text bold monospace>
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

        <Text bold monospace mt="24px">
          {selectedTargetElevation} TOTEM:
        </Text>
        {totem == null ? (
          <SummitButton elevation={selectedTargetElevation} mt="11px" mb="11px" onClick={handlePresentSelectTotem}>
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

        <Text bold monospace mt="24px" mb="12px">
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

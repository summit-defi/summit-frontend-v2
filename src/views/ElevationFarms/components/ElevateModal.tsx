import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text, Modal, ChevronRightIcon } from 'uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import SummitButton from 'uikit/components/Button/SummitButton'
import { Elevation } from 'config/constants/types'
import ElevationSelector from './ElevationSelector'
import { useElevationTotem, useSisterFarms } from 'state/hooks'
import { isNumber } from 'lodash'
import Totem from './Totem'
import { elevationPalette } from 'theme/colors'
import useSelectTotemModal from 'uikit/widgets/SelectTotemModal/useSelectTotemModal'
import { RewardsWillBeHarvestedType, useRewardsWillBeHarvestedModal } from './RewardsWillBeHarvestedModal'
import { getPriceableTokens } from 'config/constants'

interface ElevateModalProps {
  symbol: string
  tokenAddress: string

  sourceElevation?: Elevation
  targetElevation?: Elevation

  openExpeditionPage: () => void

  onConfirmElevate: (
    symbol: string,
    sourceElevation: Elevation,
    targetElevation: Elevation,
    amount: string,
    token: string,
    totem: number,
    decimals: number,
  ) => void
  onDismiss?: () => void
}

const ElevateModal: React.FC<ElevateModalProps> = ({
  symbol,
  tokenAddress = null,
  sourceElevation = null,
  targetElevation = null,
  openExpeditionPage,
  onConfirmElevate,
  onDismiss,
}) => {
  const sisterFarmsAndExpedition = useSisterFarms(symbol)

  const priceableTokens = getPriceableTokens()
  const decimals = priceableTokens.find((token) => token.symbol === symbol)?.decimals || 18


  // REWARDS WILL BE HARVESTED MODAL
  const presentRewardsWillBeHarvestedModal = useRewardsWillBeHarvestedModal(Elevation.OASIS, new BigNumber(0), 'Elevate', RewardsWillBeHarvestedType.Elevate)
  
  // const tokenDecimals =
  //   (sourceElevation || targetElevation) === Elevation.EXPEDITION
  //     ? sisterFarmsAndExpedition[Elevation.EXPEDITION].rewardToken.decimals
  //     : (sisterFarmsAndExpedition[sourceElevation || targetElevation] as Farm).tokenDecimals
  // const tokenDecimals = ((sisterFarmsAndExpedition[sourceElevation] || sisterFarmsAndExpedition[targetElevation]) as Farm).tokenDecimals

  const expeditionAvailable = sisterFarmsAndExpedition[Elevation.EXPEDITION] != null

  const disabledElevations = Object.entries(sisterFarmsAndExpedition)
    .filter(([_, sisterFarm]) => sisterFarm == null)
    .map(([sisterElevation]) => sisterElevation) as Elevation[]

  const sisterElevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT].concat(
    expeditionAvailable ? Elevation.EXPEDITION : [],
  )
  const sourceElevations =
    sourceElevation != null ? [sourceElevation] : sisterElevations.filter((elev) => elev !== targetElevation)
  const targetElevations =
    targetElevation != null ? [targetElevation] : sisterElevations.filter((elev) => elev !== sourceElevation)

  const [selectedSourceElevation, setSelectedSourceElevation] = useState(sourceElevation || null)
  const [selectedTargetElevation, setSelectedTargetElevation] = useState(targetElevation || null)
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
    if (selectedSourceElevation === Elevation.EXPEDITION) {
      const selectedExpedition = sisterFarmsAndExpedition[selectedSourceElevation]
      const newFullBalance = getFullDisplayBalance(
        selectedExpedition.userData
          ? selectedExpedition.userData[symbol === 'SUMMIT' ? 'stakedSummit' : 'stakedSummitLp'] || new BigNumber(0)
          : new BigNumber(0),
        decimals,
      )

      setFullBalance(newFullBalance)
      setVal(newFullBalance)
      setValInvalid(!validElevateVal(newFullBalance, newFullBalance))
    } else {
      const selectedFarm = sisterFarmsAndExpedition[selectedSourceElevation]
      setSourceEarned(selectedFarm.userData?.earnedReward || new BigNumber(0))
      const newFullBalance = getFullDisplayBalance(
        selectedFarm.userData?.stakedBalance || new BigNumber(0),
        decimals,
      )
      setFullBalance(newFullBalance)
      setVal(newFullBalance)
      setValInvalid(!validElevateVal(newFullBalance, newFullBalance))
    }
  }, [
    decimals,
    selectedSourceElevation,
    symbol,
    setFullBalance,
    setSourceEarned,
    setVal,
    setValInvalid,
    sisterFarmsAndExpedition,
  ])

  const handleSelectTargetElevation = useCallback(
    (newElevation: Elevation) => setSelectedTargetElevation(newElevation),
    [setSelectedTargetElevation],
  )

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setTargetEarned(sisterFarmsAndExpedition[selectedTargetElevation]!.userData?.earnedReward || new BigNumber(0))
  }, [selectedTargetElevation, sisterFarmsAndExpedition, setTargetEarned])

  const handlePresentSelectTotem = () => {
    if (selectedTargetElevation === Elevation.EXPEDITION) {
      openExpeditionPage()
      onDismiss()
    } else onPresentSelectTotemModal()
  }

  // CONFIRM ELEVATE
  const handleConfirmElevate = () => {
    onDismiss()
    presentRewardsWillBeHarvestedModal({
      elevateInfo: {
        sourceElevation: selectedSourceElevation,
        targetElevation: selectedTargetElevation,
        sourceEarned,
        targetEarned,
      },
      transactionToConfirm: () => onConfirmElevate(symbol, selectedSourceElevation, selectedTargetElevation, val, tokenAddress, totem, decimals),
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
          {selectedTargetElevation === Elevation.EXPEDITION
            ? `Transfer ${symbol} directly into the Expedition for your chance to win.`
            : `Transfer ${symbol} between elevations and skip the fees.`}
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
            {selectedTargetElevation === Elevation.EXPEDITION ? 'SELECT DEITY' : 'SELECT TOTEM'}
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
          elevation={selectedTargetElevation}
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          disabled={totem == null}
          max={fullBalance}
          symbol={symbol}
        />
      </Flex>

      <ModalActions>
        <SummitButton elevation={selectedTargetElevation} secondary onClick={onDismiss}>
          CANCEL
        </SummitButton>
        <SummitButton
          elevation={selectedTargetElevation}
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

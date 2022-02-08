import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text, Modal, ChevronRightIcon, ModalActions, SummitButton, ElevationPuck, TokenSymbolImage, Lock } from 'uikit'
import { Elevation, SummitPalette } from 'config/constants/types'
import { isNumber } from 'lodash'
import { getAdditionalEverestAwardForLockDurationIncrease, getExpectedEverestAward, getFormattedBigNumber, getFullDisplayBalance, timestampToDate, timestampToDateWithYear } from 'utils'
import ElevationSelector from '../ElevationSelector'
import TokenInput from 'components/TokenInput'
import { useEverestUserInfo, useSymbolElevateModalInfo } from 'state/hooksNew'
import { TokenSymbol } from 'config/constants'
import BigNumber from 'bignumber.js'
import { useCurrentTimestampOnce } from 'state/hooks'
import styled from 'styled-components'


const StyledLock = styled(Lock)`
  transform: rotate(20deg);
  fill: ${({ theme }) => theme.colors.textGold};
`

const LockForEverestInfoSection: React.FC<{ val: string }> = React.memo(({ val }) => {
  const {
    everestOwned,
    summitLocked,
    lockRelease,
    lockDuration,
  } = useEverestUserInfo()
  const currentTimestamp = useCurrentTimestampOnce()

  const anyEverestOwned = everestOwned.isGreaterThan(0)

  const minLockRelease = currentTimestamp + (30 * 24 * 3600)
  const newLockRelease = Math.max(minLockRelease, lockRelease)
  const releaseDate = timestampToDate(lockRelease)
  const newReleaseDate = timestampToDateWithYear(newLockRelease)

  const minLockDuration = 30
  const newLockDuration = Math.max(minLockDuration, lockDuration)

  const everestAwardFromLockDuration = getAdditionalEverestAwardForLockDurationIncrease(summitLocked, newLockDuration, everestOwned)
  const everestAwardFromLocking = getExpectedEverestAward(new BigNumber(val).times(new BigNumber(10).pow(18)), newLockDuration)
  const totalEverestAward = everestAwardFromLockDuration.plus(everestAwardFromLocking)
  const rawTotalEverestAward = getFormattedBigNumber(totalEverestAward)

  return (
    <>
      { !anyEverestOwned && 
        <Flex width='100%' alignItems='center' justifyContent='flex-start' gap='8px' mb='18px'>
          <StyledLock width='18px'/>
          <Text bold italic gold small monospace textAlign='left'>
            You have to lock SUMMIT for the first time through the EVEREST tab.
          </Text>
        </Flex>
      }
      <Text monospace bold small textAlign='center'>
        * If your current Lock Duration is less than 30 Days, it will be increased to 30 Days (this will add to your EVEREST award).
      </Text>
      <br/>
      <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%' mb='8px'>
          <Text monospace small textAlign='left'>Unlock Date:</Text>
          <Text bold monospace textAlign='right'>{releaseDate} {`==>`} {newReleaseDate}</Text>
      </Flex>
      <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%' mb='8px'>
          <Text monospace small textAlign='left'>Lock Duration:</Text>
          <Text bold monospace textAlign='right'>{lockDuration}D {`==>`} {newLockDuration}D</Text>
      </Flex>
      <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%' mb='8px'>
          <Text monospace small textAlign='left'>EVEREST Award:</Text>
          <Text bold monospace textAlign='right'>{rawTotalEverestAward} EVEREST</Text>
      </Flex>
    </>
  )
})



const InfoText = styled(Text)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`



interface LockFarmSummitForEverestProps {
  sourceElevation?: Elevation

  onConfirmLock: (
    sourceElevation: Elevation,
    amount: string,
  ) => void
  onDismiss?: () => void
}

const LockFarmSummitForEverestModal: React.FC<LockFarmSummitForEverestProps> = ({
  sourceElevation = null,
  onConfirmLock,
  onDismiss,
}) => {
  const {
    elevLaunched,
    elevStaked,
  } = useSymbolElevateModalInfo(TokenSymbol.SUMMIT)

  const sourceElevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT]
  const disabledElevations = sourceElevations.filter((elevToDisable) => !elevLaunched[elevToDisable])

  const [selectedSourceElevation, setSelectedSourceElevation] = useState(sourceElevation || null)

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
    
    const newFullBalance = getFullDisplayBalance(elevStaked[selectedSourceElevation])
    setFullBalance(newFullBalance)
    setVal(newFullBalance)
    setValInvalid(!validElevateVal(newFullBalance, newFullBalance))
  }, [
    selectedSourceElevation,
    setFullBalance,
    setVal,
    setValInvalid,
    elevStaked,
  ])

  // CONFIRM ELEVATE
  const handleConfirmLock = () => {
    onDismiss()
    onConfirmLock(selectedSourceElevation, val)
  }

  return (
    <Modal
      title='LOCK SUMMIT|br|FOR EVEREST'
      onDismiss={onDismiss}
      elevationCircleHeader={SummitPalette.EVEREST}
      headerless
    >
      <Flex gap='18px' justifyContent="center" flexDirection="column" alignItems="center" maxWidth='350px'>
      <Text textAlign="center" monospace small bold mt='-24px'>
          Directly lock your staked SUMMIT for
          <br/>
          EVEREST and avoid the Fairness Tax.
        </Text>

        <Text textAlign="center" monospace small bold mt='-24px'>
          SUMMIT will be added to your existing 
        </Text>

        <Flex justifyContent="space-around" alignItems="center" width="100%">
          <Flex flexDirection="column" alignItems="center">
            <ElevationSelector
              selected={selectedSourceElevation}
              elevations={sourceElevations}
              disabledElevations={disabledElevations}
              selectElevation={handleSelectSourceElevation}
              vertical
            />
          </Flex>

          <Flex>
            <ChevronRightIcon width="24px" mr="-8px" key="a" />
            <ChevronRightIcon width="24px" ml="-8px" key="b" />
          </Flex>

          <Flex flexDirection="column" alignItems="center">
            <TokenSymbolImage symbol={TokenSymbol.EVEREST} width={124} height={124}/>
          </Flex>
        </Flex>

        <Text bold monospace small mb='-18px'>
          AMOUNT TO LOCK:
        </Text>
        <TokenInput
          summitPalette={SummitPalette.EVEREST}
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          disabled={selectedSourceElevation == null}
          symbol='SUMMIT'
        />

        <InfoText monospace small textAlign='center'>
          <LockForEverestInfoSection val={val}/>
        </InfoText>
      </Flex>

      <ModalActions>
        <SummitButton secondary onClick={onDismiss}>
          CANCEL
        </SummitButton>
        <SummitButton
          summitPalette={SummitPalette.EVEREST}
          disabled={invalidVal || selectedSourceElevation == null}
          onClick={handleConfirmLock}
        >
          LOCK FARM SUMMIT
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

export default LockFarmSummitForEverestModal

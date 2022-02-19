import React, { useCallback, useState } from 'react'
import { Flex, Text, Modal, ModalActions, Lock } from 'uikit'
import TokenInput from '../../../components/TokenInput'
import { getFormattedBigNumber, getFullDisplayBalance } from '../../../utils/formatBalance'
import SummitButton from 'uikit/components/Button/SummitButton'
import { isNumber } from 'lodash'
import { Epoch } from 'state/types'
import { SummitPalette } from 'config/constants'
import { useEverestUserInfo } from 'state/hooksNew'
import styled from 'styled-components'
import { getAdditionalEverestAwardForLockDurationIncrease, getExpectedEverestAward, timestampToDate, timestampToDateWithYear } from 'utils'
import BigNumber from 'bignumber.js'
import { useCurrentTimestampOnce } from 'state/hooks'


const InfoText = styled(Text)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

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

interface HarvestEpochModalProps {
  epoch: Epoch
  lockForEverest?: boolean
  onHarvestEpoch: (
      amount: string,
      lockForEverest: boolean,
  ) => void
  onDismiss?: () => void
}

const HarvestEpochModal: React.FC<HarvestEpochModalProps> = ({
  epoch,
  lockForEverest = false,
  onHarvestEpoch,
  onDismiss,
}) => {
  const {
    frozenSummit,
    isThawed,
  } = epoch
  const { everestOwned } = useEverestUserInfo()
  const anyEverestOwned = everestOwned.isGreaterThan(0)

  const fullHarvestableBalance = getFullDisplayBalance(frozenSummit, 18)

  const [val, setVal] = useState(fullHarvestableBalance)
  const [invalidVal, setValInvalid] = useState(false)
  const summitPalette = lockForEverest ? SummitPalette.EVEREST : SummitPalette.BASE

  const validHarvestVal = (testVal, harvestableBalance) => {
    return (
      testVal === '' ||
      (isNumber(parseFloat(testVal)) && parseFloat(testVal) >= 0 && parseFloat(testVal) <= parseFloat(harvestableBalance))
    )
  }

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      setValInvalid(!validHarvestVal(e.currentTarget.value, fullHarvestableBalance))
    },
    [setVal, setValInvalid, fullHarvestableBalance],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullHarvestableBalance)
    setValInvalid(false)
  }, [fullHarvestableBalance, setVal, setValInvalid])

  const handleConfirmHarvestEpoch = useCallback(() => {
    if (invalidVal) return
    onDismiss()
    onHarvestEpoch(val, lockForEverest)
  }, [invalidVal, onDismiss, onHarvestEpoch, val, lockForEverest])


  return (
    <Modal
      title='Harvest|br|Epoch'
      onDismiss={onDismiss}
      elevationCircleHeader='GLACIER'
      headerless
    >
      <Flex justifyContent="center" flexDirection="column" alignItems="center" mt='-12px' maxWidth='400px'>
        <Text bold monospace>
          AMOUNT TO {lockForEverest ? 'LOCK' : 'HARVEST'}:
        </Text>
        <TokenInput
          value={val}
          summitPalette={summitPalette}
          balanceText={`EPOCH ${isThawed ? 'THAWED' : 'FROZEN'}`}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullHarvestableBalance}
          symbol='SUMMIT'
        />

        <InfoText monospace small textAlign='center' mt='24px'>
            { lockForEverest ?
              <LockForEverestInfoSection val={val}/> :
              isThawed ?
                  <>
                      This locked SUMMIT has thawed,
                      and is free to harvest.
                      <br/>
                      <br/>
                      Harvesting will not take any tax,
                      you will receive 100% of your harvest.
                  </> :
                  <>
                      This SUMMIT is still frozen,
                      a 50% tax will be taken on harvest.
                      <br/>
                      (50% burned, 50% sent to EVEREST holders)
                      <br/>
                      <br/>
                      <Flex flexDirection='row' justifyContent='center' gap='48px' alignItems='center'>
                        <Text bold monospace color='red' textAlign='left'>TAX FOR EARLY<br/>HARVEST (50%):</Text>
                        <Text bold monospace fontSize='16px' color='red' textAlign='right'>{new BigNumber(val || 0).dividedBy(2).toFixed(3)}<br/>SUMMIT</Text>
                      </Flex>
                      <br/>
                      Either Lock for EVEREST or wait until
                      this epoch thaws to avoid the tax.
                  </>
            }
        </InfoText>

        <ModalActions>
          <SummitButton secondary onClick={onDismiss}>
            CANCEL
          </SummitButton>
          <SummitButton
            summitPalette={summitPalette}
            isLocked={lockForEverest && !anyEverestOwned}
            disabled={invalidVal}
            onClick={handleConfirmHarvestEpoch}
          >
            { lockForEverest ? 'LOCK FOR EVEREST' : (isThawed ? 'HARVEST' : 'HARVEST WITH TAX')}
          </SummitButton>
        </ModalActions>
      </Flex>
    </Modal>
  )
}

export default HarvestEpochModal

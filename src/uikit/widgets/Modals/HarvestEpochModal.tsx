import React, { useCallback, useState } from 'react'
import { Flex, Text, Modal, ModalActions, Lock } from 'uikit'
import TokenInput from '../../../components/TokenInput'
import { getFormattedBigNumber, getFullDisplayBalance } from '../../../utils/formatBalance'
import SummitButton from 'uikit/components/Button/SummitButton'
import { isNumber } from 'lodash'
import { Epoch, LockSummitButtonType } from 'state/types'
import { BN_ZERO, SummitPalette } from 'config/constants'
import { useEverestUserInfo } from 'state/hooksNew'
import styled from 'styled-components'
import { getAdditionalEverestAwardForLockDurationIncrease, getExpectedEverestAward, timestampToDate, timestampToDateWithYear } from 'utils'
import BigNumber from 'bignumber.js'
import { useCurrentTimestampOnce } from 'state/hooks'
import EverestLockDurationSlider from '../EverestLockDurationSlider'
import { useLockSummit } from 'hooks/useLockSummit'


const InfoText = styled(Text)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StyledLock = styled(Lock)`
  transform: rotate(20deg);
  fill: red;
`

const LockForEverestInfoSection: React.FC<{ val: string }> = React.memo(({ val }) => {
  const {
    everestOwned,
    summitLocked,
    lockRelease,
    lockDuration,
  } = useEverestUserInfo()
  const currentTimestamp = useCurrentTimestampOnce()

  const anyEverestOwned = false && everestOwned.isGreaterThan(0)

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




interface LockDurationRequiredProps {
  summitPalette: SummitPalette
  onDismiss?: () => void
}

const LockDurationRequiredSection: React.FC<LockDurationRequiredProps> = ({
  summitPalette,
  onDismiss,
}) => {
  const [lockDuration, setLockDuration] = useState<number | null>(30)
  const { onLockSummit, lockSummitPending } = useLockSummit(LockSummitButtonType.LockSummit, BN_ZERO, lockDuration)

  const handleConfirmLockDuration = useCallback(
    () => {
      if (lockSummitPending) return
      onLockSummit()
    },
    [lockSummitPending, onLockSummit]
  )


  return (
    <Flex flexDirection='column' width='100%' alignItems='center' justifyContent='flex-start' gap='16px' mb='32px'>
      <Text bold italic color='red' small monospace textAlign='center'>
        (!) You dont have an EVEREST lock duration set, either open the EVEREST tab, or select a lock duration {`>=`} 30 days below.
      </Text>
      <SummitButton
        summitPalette={summitPalette}
        as='a'
        href='/everest'
        onClick={onDismiss}
        height='28px'
      >
        OPEN EVEREST TAB
      </SummitButton>

      <Text italic small monospace>- OR -</Text> 
      <Text bold small monospace style={{ width: '100%'}} textAlign='left' mb='-12px'>SELECT LOCK DURATION:</Text> 

      <EverestLockDurationSlider
        minLockDuration={30}
        existingLockDuration={null}
        setLockDuration={setLockDuration}
      />
      <Text bold italic color='red' small monospace textAlign='center'>
        (!) This cannot be decreased until the selected lock period ends.
      </Text>
      <SummitButton
        summitPalette={summitPalette}
        onClick={handleConfirmLockDuration}
        isLoading={lockSummitPending}
        height='28px'
      >
        CONFIRM {lockDuration}D LOCK DURATION
      </SummitButton>
    </Flex>
  )
}

interface HarvestEpochModalProps {
  asComponentOfWinningsModal?: boolean
  harvestEpochPending?: boolean
  epoch: Epoch
  lockForEverest?: boolean
  onHarvestEpoch: (
      amount: string,
      lockForEverest: boolean,
  ) => void
  onDismiss?: () => void
}

export const HarvestEpochModalContent: React.FC<HarvestEpochModalProps> = ({
  epoch,
  asComponentOfWinningsModal = false,
  harvestEpochPending = false,
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
    if (!asComponentOfWinningsModal) {
      onDismiss()
    } else
    onHarvestEpoch(val, lockForEverest)
  }, [invalidVal, asComponentOfWinningsModal, onDismiss, onHarvestEpoch, val, lockForEverest])
  

  return (
    <Flex justifyContent="center" flexDirection="column" alignItems="center" maxWidth='400px'>
      { !asComponentOfWinningsModal &&
        <Text bold monospace>
          AMOUNT TO {lockForEverest ? 'LOCK' : 'HARVEST'}:
        </Text>
      }

      { !anyEverestOwned &&
        <LockDurationRequiredSection
          summitPalette={summitPalette}
        />
      }

      <TokenInput
        value={val}
        summitPalette={summitPalette}
        disabled={!anyEverestOwned}
        balanceText={asComponentOfWinningsModal ? 'FROZEN WINNINGS' : `EPOCH ${isThawed ? 'THAWED' : 'FROZEN'}`}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullHarvestableBalance}
        symbol='SUMMIT'
      />

      <InfoText monospace small textAlign='center' mt='24px'>
          { lockForEverest ?
            (anyEverestOwned ? <LockForEverestInfoSection val={val}/> : null) :
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
        { !asComponentOfWinningsModal &&
          <SummitButton secondary onClick={onDismiss}>
            CANCEL
          </SummitButton>
        }
        <SummitButton
          summitPalette={summitPalette}
          isLocked={lockForEverest && !anyEverestOwned}
          isLoading={harvestEpochPending}
          disabled={invalidVal}
          onClick={handleConfirmHarvestEpoch}
        >
          { lockForEverest ? 'LOCK FOR EVEREST' : (isThawed ? 'HARVEST' : 'HARVEST WITH TAX')}
        </SummitButton>
      </ModalActions>
    </Flex>
  )
}

const HarvestEpochModal: React.FC<HarvestEpochModalProps> = ({
  epoch,
  lockForEverest = false,
  onHarvestEpoch,
  onDismiss,
}) => {
  return (
    <Modal
      title='Harvest|br|Epoch'
      onDismiss={onDismiss}
      elevationCircleHeader='GLACIER'
      headerless
    >
      <HarvestEpochModalContent
        lockForEverest={lockForEverest}
        epoch={epoch}
        onHarvestEpoch={onHarvestEpoch}
        onDismiss={onDismiss}
      />
    </Modal>
  )
}

export default HarvestEpochModal

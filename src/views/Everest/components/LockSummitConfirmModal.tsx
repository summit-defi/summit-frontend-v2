import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text, Modal, HighlightedText } from 'uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from '../../../components/TokenInput'
import { getFormattedBigNumber, getFullDisplayBalance } from '../../../utils/formatBalance'
import SummitButton from 'uikit/components/Button/SummitButton'
import { isNumber } from 'lodash'
import { elevationPalette } from 'theme/colors'
import { Epoch, LockSummitButtonType } from 'state/types'
import HarvestLockForEverestSelector from './HarvestLockForEverestSelector'
import BigNumber from 'bignumber.js'
import { lockDurationTextLong, timestampToDateWithYear } from 'utils'

interface LockSummitConfirmModalProps {
  type: LockSummitButtonType
  lockDuration: number | null
  lockRelease: number
  everestAward: BigNumber
  onLockSummit: () => void
  onDismiss?: () => void
}

const getTitle = (type: LockSummitButtonType) => {
  switch (type) {
    case LockSummitButtonType.IncreaseLockedSummit: return 'INCREASE|br|LOCKED SUMMIT'
    case LockSummitButtonType.IncreaseLockDuration: return 'INCREASE|br|LOCK DURATION'
    default:
    case LockSummitButtonType.LockSummit: return 'LOCK|br|SUMMIT'
  }
}

const LockSummitConfirmModal: React.FC<LockSummitConfirmModalProps> = ({
  type,
  lockDuration,
  lockRelease,
  everestAward,
  onLockSummit,
  onDismiss,
}) => {

  const title = getTitle(type)
  const rawEverestAward = getFormattedBigNumber(everestAward)
  const lockDurationString = lockDurationTextLong(lockDuration)
  const releaseDate = timestampToDateWithYear(lockRelease)

  console.log(lockDuration)

  return (
    <Modal
      title={title}
      onDismiss={onDismiss}
      elevationCircleHeader='BLUE'
      headerless
    >
      <Flex gap='24px' flexDirection='column' alignItems='center' justifyContent='center'>
        <Text monospace small textAlign='center'>
          { type === LockSummitButtonType.LockSummit &&
            <>
              Confirm locking your SUMMIT for
              <br/>
              <Flex alignItems='center' gap='6px' justifyContent='center'>
                <Text bold monospace>{lockDurationString}</Text>
                <Text monospace small>until</Text>
                <Text bold monospace>{releaseDate}</Text>
              </Flex>
            </>
          }
          { type === LockSummitButtonType.IncreaseLockedSummit &&
            <>
              Confirm locking additional SUMMIT until
              <Text bold monospace>{releaseDate}</Text>
            </>
          }
          { type === LockSummitButtonType.IncreaseLockDuration &&
            <>
              Confirm an increased SUMMIT lock duration of
              <br/>
              <Flex alignItems='center' gap='6px' justifyContent='center'>
                <Text bold monospace>{lockDurationString}</Text>
                <Text monospace small>, unlocking on</Text>
                <Text bold monospace>{releaseDate}</Text>
              </Flex>
            </>
          }
        </Text>

        <Flex alignItems='center' justifyContent='center'>
          <Text monospace small textAlign='center'>
            EVEREST award:
          </Text>
          <HighlightedText bold monospace fontSize='22px' ml='4px' mr='4px' lineHeight='22px'>{rawEverestAward}</HighlightedText>
          <HighlightedText bold monospace fontSize='14px' ml='4px' mr='4px' lineHeight='14px'>EVEREST</HighlightedText>
        </Flex>

        <Text bold monospace textAlign='center'>
          LOCKED SUMMIT WILL ONLY UNLOCK
          <br/>
          WHEN THE LOCK PERIOD ENDS
        </Text>
      </Flex>
            

      <ModalActions>
        <SummitButton secondary onClick={onDismiss}>
          CANCEL
        </SummitButton>
        <SummitButton
          onClick={onLockSummit}
        >
          CONFIRM
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

export default LockSummitConfirmModal

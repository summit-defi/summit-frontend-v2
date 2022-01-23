import BigNumber from 'bignumber.js'
import TokenInput from 'components/TokenInput'
import { useLockSummit } from 'hooks/useLockSummit'
import { isNumber } from 'lodash'
import { transparentize } from 'polished'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useCurrentTimestampOnce } from 'state/hooks'
import { LockSummitButtonType } from 'state/types'
import styled from 'styled-components'
import { Flex, Text, HighlightedText, useModal } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { getAdditionalEverestAwardForLockDurationIncrease, getExpectedEverestAward, getFormattedBigNumber, getFullDisplayBalance, lockDurationTextLong, timestampToDateWithYear } from 'utils'
import EverestLockDurationSlider from './EverestLockDurationSlider'
import LockSummitConfirmModal from './LockSummitConfirmModal'


interface LockSummitButtonProps {
    disabled: boolean
    type: LockSummitButtonType
    amount: BigNumber | null
    duration: number | null
    lockRelease: number | null
    everestAward: BigNumber
}

const lockSummitButtonText = (type: LockSummitButtonType) => {
    switch (type) {
        case LockSummitButtonType.IncreaseLockedSummit: return 'INCREASE LOCKED SUMMIT'
        case LockSummitButtonType.IncreaseLockDuration: return 'INCREASE LOCK DURATION'
        default:
        case LockSummitButtonType.LockSummit: return 'LOCK SUMMIT'
    }
}

export const LockSummitInfoAndButton: React.FC<LockSummitButtonProps> = ({ disabled, type, amount, duration, everestAward, lockRelease }) => {
    // INFO
    const showLockRelease = type !== LockSummitButtonType.IncreaseLockedSummit
    const rawEverestAward = everestAward != null ? `${getFormattedBigNumber(everestAward)} EVEREST` : '-'
    const releaseDate = lockRelease != null ? timestampToDateWithYear(lockRelease) : '-'
    
    // BUTTON
    const buttonText = lockSummitButtonText(type)
    const { onLockSummit, lockSummitPending } = useLockSummit(type, amount, duration)
    const [onPresentLockSummitConfirmModal] = useModal(
        <LockSummitConfirmModal
            type={type}
            lockDuration={duration}
            lockRelease={lockRelease}
            everestAward={everestAward}
            onLockSummit={onLockSummit}
        />
    )

    const handlePresentConfirmModal = () => {
        if (lockSummitPending) return
        onPresentLockSummitConfirmModal()
    }
    return (
        <Flex flexDirection='column' width='calc(100% - 72px)' alignItems='center' justifyContent='center' gap='8px'>
            { showLockRelease &&
                <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                    <Text monospace small>Lock Release Date:</Text>
                    <Text bold monospace>{releaseDate}</Text>
                </Flex>
            }
            <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Text monospace small>Everest Award:</Text>
                <Text bold monospace>{rawEverestAward}</Text>
            </Flex>
            <SummitButton
                disabled={disabled}
                onClick={handlePresentConfirmModal}
                mt='4px'
                mb='4px'
            >
                {buttonText}
            </SummitButton>
        </Flex>
    )
}
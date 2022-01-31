import React from 'react'
import BigNumber from 'bignumber.js'
import { SummitPalette } from 'config/constants'
import { useApproveAddress } from 'hooks/useApprove'
import { useSummitToken } from 'hooks/useContract'
import { useLockSummit } from 'hooks/useLockSummit'
import { LockSummitButtonType } from 'state/types'
import { Flex, Text, useModal } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { getEverestTokenAddress, getFormattedBigNumber, timestampToDateWithYear } from 'utils'
import LockSummitConfirmModal from './LockSummitConfirmModal'


interface LockSummitButtonProps {
    approved: boolean
    disabled: boolean
    type: LockSummitButtonType
    amount: BigNumber | null
    duration: number | null
    lockRelease: number | null
    everestAward: BigNumber
}

const lockSummitButtonText = (approved: boolean, type: LockSummitButtonType) => {
    if (!approved) return 'APPROVE SUMMIT'
    switch (type) {
        case LockSummitButtonType.IncreaseLockedSummit: return 'INCREASE LOCKED SUMMIT'
        case LockSummitButtonType.IncreaseLockDuration: return 'INCREASE LOCK DURATION'
        default:
        case LockSummitButtonType.LockSummit: return 'LOCK SUMMIT'
    }
}

export const LockSummitInfoAndButton: React.FC<LockSummitButtonProps> = ({ approved, disabled, type, amount, duration, everestAward, lockRelease }) => {

    // APPROVAL
    const everestAddress = getEverestTokenAddress()
    const summitContract = useSummitToken()
    const { onApprove, pending: approvalPending } = useApproveAddress(summitContract, everestAddress, 'SUMMIT')

    // INFO
    const showLockRelease = type !== LockSummitButtonType.IncreaseLockedSummit
    const rawEverestAward = !disabled && everestAward != null ? `${getFormattedBigNumber(everestAward)} EVEREST` : '-'
    const releaseDate = !disabled && lockRelease != null ? timestampToDateWithYear(lockRelease) : '-'
    
    // BUTTON
    const buttonText = lockSummitButtonText(approved, type)
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

    const handleButtonPress = () => {
        if (lockSummitPending) return
        if (!approved) {
            onApprove()
            return
        }
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
                disabled={disabled && approved}
                onClick={handleButtonPress}
                summitPalette={SummitPalette.EVEREST}
                isLoading={lockSummitPending || approvalPending}
                mt='4px'
                mb='4px'
            >
                {buttonText}
            </SummitButton>
        </Flex>
    )
}
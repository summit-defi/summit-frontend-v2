import { SummitPalette } from 'config/constants'
import useLockFarmSummitForEverest from 'hooks/useLockFarmSummitForEverest'
import React, { memo } from 'react'
import { useSelectedElevation } from 'state/hooks'
import { Flex, Text, SummitButton, useModal } from 'uikit'
import LockFarmSummitForEverestModal from './LockFarmSummitForEverestModal'


export const LockFarmingSummitForEverest: React.FC = memo(() => {
    const elevation = useSelectedElevation()
    const { pending, onLockFarmSummitForEverest } = useLockFarmSummitForEverest()

    const [onPresentLockFarmSummit] = useModal(
        <LockFarmSummitForEverestModal
            sourceElevation={elevation}
            onConfirmLock={onLockFarmSummitForEverest}
        />,
    )
    const handleLockSummit = () => {
        onPresentLockFarmSummit()
    }

    return (
        <Flex flexDirection='column' gap='12px' alignItems='center' justifyContent='flex-start'>
            <Text bold monospace small textAlign='center' lineHeight='20px'>
                LOCK SUMMIT:
            </Text>
            <SummitButton
                summitPalette={SummitPalette.EVEREST}
                isLoading={pending}
                onClick={handleLockSummit}
            >
                    LOCK FARM SUMMIT
                    <br/>
                    FOR EVEREST
            </SummitButton>
        </Flex>
    )
})
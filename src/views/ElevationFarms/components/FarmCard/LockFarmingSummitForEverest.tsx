import { useWeb3React } from '@web3-react/core'
import { SummitPalette } from 'config/constants'
import useLockFarmSummitForEverest from 'hooks/useLockFarmSummitForEverest'
import React, { memo } from 'react'
import { useSelectedElevation } from 'state/hooks'
import { SummitButton, useModal } from 'uikit'
import LockFarmSummitForEverestModal from './LockFarmSummitForEverestModal'


export const LockFarmingSummitForEverest: React.FC = memo(() => {
    const elevation = useSelectedElevation()
    const { pending, onLockFarmSummitForEverest } = useLockFarmSummitForEverest()
    const { account } = useWeb3React()

    const [onPresentLockFarmSummit] = useModal(
        <LockFarmSummitForEverestModal
            sourceElevation={elevation}
            onConfirmLock={onLockFarmSummitForEverest}
        />,
    )

    return (
        <SummitButton
            summitPalette={SummitPalette.EVEREST}
            isLoading={pending}
            disabled={account == null}
            padding='18px'
            width='140px'
            onClick={onPresentLockFarmSummit}
        >
            LOCK FOR EVEREST
        </SummitButton>
    )
})
import React, { useMemo, useCallback } from 'react'
import { useHarvestEpoch } from 'hooks/useHarvestEpoch'
import { makeSelectEpochByIndex, useSelector } from 'state/hooksNew'
import { useModal, SummitButton } from 'uikit'
import HarvestEpochModal from './HarvestEpochModal'

interface Props {
    epochIndex: number
    width?: string
    height?: string
}

const HarvestEpochButton: React.FC<Props> = ({ epochIndex, width = '160px', height }) => {
    const epochByIndexSelector = useMemo(makeSelectEpochByIndex, [])
    const epoch = useSelector((state) => epochByIndexSelector(state, epochIndex))
    
    const nothingToHarvest = epoch.frozenSummit.isEqualTo(0)
    const { onHarvestEpoch, harvestEpochPending } = useHarvestEpoch(epochIndex)
    const [onPresentHarvestEpoch] = useModal(
        <HarvestEpochModal
            epoch={epoch}
            onHarvestEpoch={onHarvestEpoch}
        />
    )
    const handlePresentHarvestEpoch = useCallback(() => {
        if (harvestEpochPending || nothingToHarvest) return
        onPresentHarvestEpoch()
    }, [harvestEpochPending, nothingToHarvest, onPresentHarvestEpoch])

    return (
        <SummitButton
            isLoading={harvestEpochPending}
            disabled={nothingToHarvest}
            width={width}
            padding='0px'
            height={height}
            onClick={handlePresentHarvestEpoch}
        >
            HARVEST EPOCH
        </SummitButton>
    )
}

export default React.memo(HarvestEpochButton, (prev, next) => prev.epochIndex === next.epochIndex)
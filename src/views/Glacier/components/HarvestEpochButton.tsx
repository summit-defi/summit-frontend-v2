import { useHarvestEpoch } from 'hooks/useHarvestEpoch'
import React from 'react'
import { useEpochByIndex } from 'state/hooks'
import { useModal } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import HarvestEpochModal from './HarvestEpochModal'

interface Props {
    epochIndex: number
    width?: string
    height?: string
}

const HarvestEpochButton: React.FC<Props> = ({ epochIndex, width = '160px', height }) => {
    const epoch = useEpochByIndex(epochIndex)
    const nothingToHarvest = epoch.frozenSummit.isEqualTo(0)
    const { onHarvestEpoch, harvestEpochPending } = useHarvestEpoch(epochIndex)
    const [onPresentHarvestEpoch] = useModal(
        <HarvestEpochModal
            epoch={epoch}
            onHarvestEpoch={onHarvestEpoch}
        />
    )
    const handlePresentHarvestEpoch = () => {
        if (harvestEpochPending || nothingToHarvest) return
        onPresentHarvestEpoch()
    }

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
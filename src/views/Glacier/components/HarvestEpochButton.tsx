import BigNumber from 'bignumber.js'
import { useHarvestEpoch } from 'hooks/useHarvestEpoch'
import React from 'react'
import { useEpochByIndex } from 'state/hooks'
import { useModal } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import HarvestEpochModal from './HarvestEpochModal'

interface Props {
    epochIndex: number
}

const HarvestEpochButton: React.FC<Props> = ({ epochIndex }) => {
    const epoch = useEpochByIndex(epochIndex)
    const sanitizedEpoch = {
        index: epoch.index,
        frozenSummit: new BigNumber(epoch.winnings).times(new BigNumber(10).pow(18)),
        isThawed: epoch.thawed,
    }
    const nothingToHarvest = epoch.winnings === 0
    const { onHarvestEpoch, harvestEpochPending } = useHarvestEpoch(epochIndex)
    const [onPresentHarvestEpoch] = useModal(
        <HarvestEpochModal
            epoch={sanitizedEpoch}
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
            width='160px'
            onClick={handlePresentHarvestEpoch}
        >
            HARVEST EPOCH
        </SummitButton>
    )
}

export default React.memo(HarvestEpochButton, (prev, next) => prev.epochIndex === next.epochIndex)
import React from "react"
import { useMultiElevStaked } from "state/hooks"
import { useFarmsUserDataLoaded, useSceneryScreenshot } from "state/hooksNew"
import { Flex, HighlightedText, Skeleton, Text } from "uikit"
import ContributionBreakdown from "views/ElevationFarms/components/ContributionBreakdown"
import StakingBreakdown from "./StakingBreakdown"

const SceneryStakingBreakdown: React.FC = () => {
    const { totalTVL, tvlContributions } = useMultiElevStaked()
    const userDataLoaded = useFarmsUserDataLoaded()

    return (
        <Flex width='100%' maxWidth='850px' alignItems='center' justifyContent='center' flexDirection='column'>
            <StakingBreakdown
                loaded={userDataLoaded}
                contributions={tvlContributions}
            />
        </Flex>
    )
}

export default React.memo(SceneryStakingBreakdown)
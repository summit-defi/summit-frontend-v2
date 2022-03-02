import React, { memo } from "react";
import { ElevationFarmTab, TokenLpSource } from "config/constants";
import { useElevationFarmsTab } from "state/hooks";
import styled from "styled-components";
import { Flex, Tag, Text, TokenSymbolImage } from "uikit";
import memoize from "fast-memoize";

const MultiplierTagItem = styled(Tag)<{ elevationTab: ElevationFarmTab }>`
    font-family: Courier Prime, monospace;
    font-size: 11px;
    min-width: 42px;
    justify-content: center;
    background-color: ${({ theme, elevationTab }) => theme.colors[elevationTab]};
    border-color: ${({ theme, elevationTab }) => theme.colors[elevationTab]};
`

const elevationMultiplier = memoize((tab) => {
    switch(tab) {
        case ElevationFarmTab.PLAINS: return 110
        case ElevationFarmTab.MESA: return 125
        case ElevationFarmTab.SUMMIT: return 150
        default:
        case ElevationFarmTab.DASH:
        case ElevationFarmTab.OASIS: return 100
    }
})

const MultiplierTag: React.FC<{ allocation: number }> = memo(({ allocation }) => {
    const elevationTab = useElevationFarmsTab()
    const elevMult = elevationMultiplier(elevationTab)
    return (
        <MultiplierTagItem elevationTab={elevationTab} variant="secondary">
            {((allocation * elevMult) / 10000)}X
        </MultiplierTagItem>
    )
})

interface Props {
    symbol: string
    lpSource?: TokenLpSource
    name?: string
    allocation: number
    live: boolean
}

const FarmIconAndAllocation: React.FC<Props> = ({ symbol, lpSource, name, allocation, live }) => {
    return (
        <Flex gap='8px' width='180px' justifyContent="flex-start" alignItems="center">
            <TokenSymbolImage symbol={symbol} width={52} height={52} />
            <Flex flexDirection="column" alignItems="flex-start">
                <Text italic monospace bold fontSize="14px" lineHeight="14px" mb={lpSource != null ? '0px' : '4px'} textAlign="left">
                    {name || symbol}
                </Text>
                { lpSource != null && <Text monospace bold italic fontSize='10px' mb="4px">{lpSource}</Text> }
                <MultiplierTag allocation={live ? allocation : 0}/>
            </Flex>
        </Flex>
    )
}

export default React.memo(FarmIconAndAllocation)
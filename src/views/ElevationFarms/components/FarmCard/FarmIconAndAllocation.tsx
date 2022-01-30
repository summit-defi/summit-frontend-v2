import React, { memo } from "react";
import { ElevationFarmTab } from "config/constants";
import { useElevationFarmsTab, useSelectedElevation } from "state/hooks";
import styled from "styled-components";
import { Flex, Tag, Text, TokenSymbolImage } from "uikit";

const MultiplierTagItem = styled(Tag)<{ elevationTab: ElevationFarmTab }>`
  font-family: 'Courier Prime', monospace;
  background-color: ${({ theme, elevationTab }) => theme.colors[elevationTab]};
  border-color: ${({ theme, elevationTab }) => theme.colors[elevationTab]};
`

const MultiplierTag: React.FC<{ allocation: number }> = memo(({ allocation }) => {
    const elevationTab = useElevationFarmsTab()
    return (
        <MultiplierTagItem elevationTab={elevationTab} variant="secondary">
            {(allocation / 100).toFixed(1)}X
        </MultiplierTagItem>
    )
})

interface Props {
    symbol: string
    allocation: number
}

const FarmIconAndAllocation: React.FC<Props> = ({ symbol, allocation }) => {
    return (
        <Flex gap='8px' width='180px' justifyContent="flex-start" alignItems="center">
            <TokenSymbolImage symbol={symbol} width={52} height={52} />
            <Flex flexDirection="column" alignItems="flex-start">
                <Text italic monospace bold fontSize="14px" lineHeight="14px" mb="4px" textAlign="left">
                    {symbol}
                </Text>
                <MultiplierTag allocation={allocation}/>
            </Flex>
        </Flex>
    )
}

export default React.memo(FarmIconAndAllocation)
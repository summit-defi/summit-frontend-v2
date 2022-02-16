import BigNumber from 'bignumber.js'
import { ElevationFarmTab } from 'config/constants'
import React, { memo, useMemo } from 'react'
import { useElevationFarmsTab } from 'state/hooks'
import { useSummitPrice } from 'state/hooksNew'
import styled from 'styled-components'
import { Skeleton, Text } from 'uikit'
import { capitalizeFirstLetter, nFormatter } from 'utils'

const FlexInfoItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    max-width: 78px;
`

const InfoItemValue = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50px;
`

interface Props {
    summitPerYear: BigNumber
    totalValue: BigNumber
}

export const FarmAPYBreakdown: React.FC<Props> = memo(({ summitPerYear, totalValue }) => {
    const elevationTab = useElevationFarmsTab()
    const summitPrice = useSummitPrice()

    const earningsPerYear = summitPrice.times(summitPerYear).dividedBy(new BigNumber(10).pow(16))
    const apr = earningsPerYear.dividedBy((totalValue != null && totalValue.isGreaterThan(0)) ? totalValue : new BigNumber(1)).toNumber()

    const apy = useMemo(
        () => ((1 + (apr / 100) / 365) ** 365 - 1) * 100,
        [apr]
    )

    const dailyAPR = (apr && apr / 365)
    
    const apyText = `${elevationTab === ElevationFarmTab.DASH ? 'Base' : capitalizeFirstLetter(elevationTab)} APY`

    const yearlyApyText = `${nFormatter(apy)}%`
    const dailyApyText = `DAILY APR ${nFormatter(dailyAPR)}%`

    
    return (
        <FlexInfoItem>
            <Text small>{apyText}</Text>
            <InfoItemValue>
                <Text bold monospace small style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
                        {yearlyApyText || <Skeleton height={24} width={80} />}
                </Text>
                <Text bold monospace fontSize='11px' style={{ display: 'flex', alignItems: 'center', lineHeight: '16px' }}>
                        {dailyApyText || <Skeleton height={24} width={80} />}
                </Text>
            </InfoItemValue>
        </FlexInfoItem>
    )
})

export const FarmTotalValue: React.FC<{ totalValue: BigNumber }> = memo(({ totalValue }) => {
    const elevationTab = useElevationFarmsTab()

    const totalValueFormatted = totalValue
        ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : '-'

    const tvlText = `${elevationTab === ElevationFarmTab.DASH ? '' : `${capitalizeFirstLetter(elevationTab)} `}TVL`

    return (
        <FlexInfoItem>
            <Text small>{tvlText}</Text>
            <InfoItemValue>
                <Text bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
                    {totalValueFormatted}
                </Text>
            </InfoItemValue>
        </FlexInfoItem>
    )
})
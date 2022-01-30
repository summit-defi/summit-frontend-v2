import BigNumber from 'bignumber.js'
import React, { memo, useMemo } from 'react'
import { useSummitPrice } from 'state/hooksNew'
import styled from 'styled-components'
import { Skeleton, Text } from 'uikit'
import { nFormatter } from 'utils'

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

const compoundEventCount = 365

export const FarmAPYBreakdown: React.FC<Props> = memo(({ summitPerYear, totalValue }) => {
    const summitPrice = useSummitPrice()

    const apr = summitPrice
        .times(summitPerYear)
        .div(totalValue.isGreaterThan(0) ? totalValue : new BigNumber(1))
        .toNumber()

    const apy = useMemo(
        () => ((1 + (apr / compoundEventCount)) ** compoundEventCount) - 1,
        [apr]
    )

    const farmAvgAPY = apy * 100
    const dailyAPR = (apr && apr / 3.65)
    
    const yearlyAPY = !apy ? null : apy > 1000000000 ? '🔥🔥' : apy > 1000000 ? '🔥' : `${nFormatter(farmAvgAPY, 2)}%`
    const dailyAPY = !dailyAPR ? null : dailyAPR > 1000000000 ? '🔥🔥' : dailyAPR > 1000000 ? '🔥' : `${nFormatter(dailyAPR, 2)}%`
    
    return (
        <FlexInfoItem>
            <Text small>APY</Text>
            <InfoItemValue>
                <Text bold monospace fontSize='12px' style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
                        {yearlyAPY || <Skeleton height={24} width={80} />}
                </Text>
                <Text bold monospace fontSize='11px' style={{ display: 'flex', alignItems: 'center', lineHeight: '16px' }}>
                        {dailyAPY || <Skeleton height={24} width={80} />}
                </Text>
            </InfoItemValue>
        </FlexInfoItem>
    )
})

export const FarmTotalValue: React.FC<{ totalValue: BigNumber }> = memo(({ totalValue }) => {

    const totalValueFormatted = totalValue
        ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : '-'

    return (
        <FlexInfoItem>
            <Text small>TVL</Text>
            <InfoItemValue>
                <Text bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
                    {totalValueFormatted}
                </Text>
            </InfoItemValue>
        </FlexInfoItem>
    )
})
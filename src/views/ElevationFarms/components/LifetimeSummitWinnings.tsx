import React, { memo } from 'react'
import { ElevationFarmTab } from 'config/constants'
import { useLifetimeSummitWinningsAndBonus } from 'state/hooksNew'
import styled from 'styled-components'
import { HighlightedText, MobileColumnFlex, Text } from 'uikit'
import { getFormattedBigNumber } from 'utils'
import { useElevationFarmsTab } from 'state/hooks'

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    
    ${({ theme }) => theme.mediaQueries.nav} {
        margin-top: -86px;
    }
`

const ItemFlex = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
`

const Spacer = styled.div`
    flex: 0.75;
    height: 10px;
    display: none;

    ${({ theme }) => theme.mediaQueries.nav} {
        display: flex;
    }
`

const ValueText = styled(MobileColumnFlex)`
    margin-top: 8px;
    ${({ theme }) => theme.mediaQueries.nav} {
        gap: 6px;
    }
`

const DashboardLifetimeSummitWinnings: React.FC = memo(() => {
    const {
        lifetimeSummitWinnings,
        lifetimeSummitBonuses,
    } = useLifetimeSummitWinningsAndBonus()
    const rawLifetimeSummitWinnings = getFormattedBigNumber(lifetimeSummitWinnings)
    const rawLifetimeSummitBonuses = getFormattedBigNumber(lifetimeSummitBonuses)

    return (
        <Wrapper>
            <ItemFlex>
                <Text bold monospace small>
                    LIFETIME WINNINGS
                </Text>
                <ValueText>
                    <HighlightedText bold monospace fontSize='22' lineHeight='22px'>
                        {rawLifetimeSummitWinnings}
                    </HighlightedText>
                    <HighlightedText monospace fontSize='14' lineHeight='14px'>
                        SUMMIT
                    </HighlightedText>
                </ValueText>
            </ItemFlex>
            <Spacer/>
            <ItemFlex>
                <Text bold monospace small>
                    LIFETIME LOYALTY BONUS
                </Text>
                <ValueText>
                    <HighlightedText bold monospace fontSize='22' lineHeight='22px'>
                        {rawLifetimeSummitBonuses}
                    </HighlightedText>
                    <HighlightedText monospace fontSize='14' lineHeight='14px'>
                        SUMMIT
                    </HighlightedText>
                </ValueText>
            </ItemFlex>
        </Wrapper>
    )
})

export const LifetimeSummitWinnings: React.FC = memo(() => {
    const elevationTab = useElevationFarmsTab()

    if (elevationTab !== ElevationFarmTab.DASH) return null
    return <DashboardLifetimeSummitWinnings/>
})
import React, { memo } from 'react'
import { ElevationFarmTab } from 'config/constants'
import { useLifetimeSummitWinningsAndBonus, useFarmsUserDataLoaded } from 'state/hooksNew'
import styled from 'styled-components'
import { HighlightedText, MobileColumnFlex, Text, Skeleton } from 'uikit'
import { getFormattedBigNumber } from 'utils'
import { useElevationFarmsTab } from 'state/hooks'
import { useWallet } from '@binance-chain/bsc-use-wallet'

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    
    ${({ theme }) => theme.mediaQueries.nav} {
        position: absolute;
        top: 18px;
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
    const userDataLoaded = useFarmsUserDataLoaded()
    const rawLifetimeSummitWinnings = getFormattedBigNumber(lifetimeSummitWinnings)
    const rawLifetimeSummitBonuses = getFormattedBigNumber(lifetimeSummitBonuses)
    const { account } = useWallet()

    if (account == null) return null

    return (
        <Wrapper>
            <ItemFlex>
                <Text textAlign='center' bold monospace small>
                    LIFETIME WINNINGS
                </Text>
                { userDataLoaded ?
                    <ValueText>
                        <HighlightedText bold monospace fontSize='22' lineHeight='22px'>
                            {rawLifetimeSummitWinnings}
                        </HighlightedText>
                        <HighlightedText monospace fontSize='14' lineHeight='14px'>
                            SUMMIT
                        </HighlightedText>
                    </ValueText> :
                    <Skeleton height={24} width={180}/>
                }
            </ItemFlex>
            <Spacer/>
            <ItemFlex>
                <Text textAlign='center' bold monospace small>
                    LIFETIME LOYALTY BONUS
                </Text>
                { userDataLoaded ?
                    <ValueText>
                        <HighlightedText bold monospace fontSize='22' lineHeight='22px'>
                            {rawLifetimeSummitBonuses}
                        </HighlightedText>
                        <HighlightedText monospace fontSize='14' lineHeight='14px'>
                            SUMMIT
                        </HighlightedText>
                    </ValueText> :
                    <Skeleton height={24} width={180}/>
                }
            </ItemFlex>
        </Wrapper>
    )
})

export const LifetimeSummitWinnings: React.FC = memo(() => {
    const elevationTab = useElevationFarmsTab()

    if (elevationTab !== ElevationFarmTab.DASH) return null
    return <DashboardLifetimeSummitWinnings/>
})
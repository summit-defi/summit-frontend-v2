import React, { memo } from 'react'
import { useGlacierTotalFrozenSummit, useGlacierTotalThawedSummit } from 'state/hooksNew'
import styled from 'styled-components'
import { HighlightedText, MobileColumnFlex, Text } from 'uikit'
import { getFormattedBigNumber } from 'utils'

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
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

export const GlacierTotalSummitAmounts: React.FC = memo(() => {
    const totalFrozenSummit = useGlacierTotalFrozenSummit()
    const totalThawedSummit = useGlacierTotalThawedSummit()
    const rawTotalFrozenSummit = getFormattedBigNumber(totalFrozenSummit)
    const rawTotalThawedSummit = getFormattedBigNumber(totalThawedSummit)

    return (
        <Wrapper>
            <ItemFlex>
                <Text bold monospace small>
                    TOTAL FROZEN SUMMIT
                </Text>
                <ValueText>
                    <HighlightedText bold monospace fontSize='22' lineHeight='22px'>
                        {rawTotalFrozenSummit}
                    </HighlightedText>
                    <HighlightedText monospace fontSize='14' lineHeight='14px'>
                        SUMMIT
                    </HighlightedText>
                </ValueText>
            </ItemFlex>
            <Spacer/>
            <ItemFlex>
                <Text bold monospace small>
                    TOTAL THAWED SUMMIT
                </Text>
                <ValueText>
                    <HighlightedText bold monospace fontSize='22' lineHeight='22px'>
                        {rawTotalThawedSummit}
                    </HighlightedText>
                    <HighlightedText monospace fontSize='14' lineHeight='14px'>
                        SUMMIT
                    </HighlightedText>
                </ValueText>
            </ItemFlex>
        </Wrapper>
    )
})
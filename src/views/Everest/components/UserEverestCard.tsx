import PageLoader from "components/PageLoader"
import React, { memo } from "react"
import { useEverestDataLoaded, useUserHasLockedSummit } from "state/hooks"
import styled from "styled-components"
import { Flex, HighlightedText } from "uikit"
import { IncreaseLockDurationSection } from "./IncreaseLockDurationSection"
import { IncreaseLockedAmountSection } from "./IncreaseLockedAmountSection"
import { InitialSummitLockSection } from "./InitialSummitLockSection"


export const EverestCard = styled(Flex)`
    flex-direction: column;
    justify-content: flex-start;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 6px;
    padding: 18px;
    flex: 1;
    padding-top: 112px;
    min-width: 350px;
    min-height: 400px;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};

    ${({ theme }) => theme.mediaQueries.nav} {
        padding-top: 32px;
    }
`


export const UserEverestCard: React.FC = memo(() => {
    const userHasLockedSummit = useUserHasLockedSummit()
        
    return (
        <EverestCard gap='32px' alignItems='center' justifyContent='center'>
            <HighlightedText bold monospace textAlign='center'>
                LOCK SUMMIT
            </HighlightedText>
            { userHasLockedSummit ?
                <>
                    <IncreaseLockedAmountSection/>
                    <IncreaseLockDurationSection/>
                </> :
                <InitialSummitLockSection/>
            }
        </EverestCard>
    )
})
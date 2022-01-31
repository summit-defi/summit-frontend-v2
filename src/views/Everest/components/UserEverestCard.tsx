import { BN_ZERO } from "config/constants"
import React, { memo } from "react"
import { useEverestUserInfo } from "state/hooksNew"
import styled from "styled-components"
import { Flex, HighlightedText } from "uikit"
import { IncreaseLockDurationSection } from "./IncreaseLockDurationSection"
import { IncreaseLockedAmountSection } from "./IncreaseLockedAmountSection"
import { InitialSummitLockSection } from "./InitialSummitLockSection"


const EverestCard = styled(Flex)`
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
    const userEverestInfo = useEverestUserInfo()
    const userHasLockedSummit = (userEverestInfo?.summitLocked || BN_ZERO).isGreaterThan(0)
    const summitApproved = (userEverestInfo?.summitAllowance || BN_ZERO).isGreaterThan(0)

    return (
        <EverestCard gap='32px' alignItems='center' justifyContent='center'>
            <HighlightedText bold monospace textAlign='center'>
                LOCK SUMMIT
            </HighlightedText>
            { userHasLockedSummit ?
                <>
                    <IncreaseLockedAmountSection userEverestInfo={userEverestInfo}/>
                    <IncreaseLockDurationSection userEverestInfo={userEverestInfo}/>
                </> :
                <InitialSummitLockSection
                    summitBalance={userEverestInfo.summitBalance}
                    summitApproved={summitApproved}
                />
            }
        </EverestCard>
    )
})
import React, { memo } from "react"
import { useExpeditionRoundEmission } from "state/hooksNew"
import styled from "styled-components"
import { TokenSymbolImage, Text } from "uikit"
import { getFormattedBigNumber } from "utils"

const RewardTokensGrid = styled.div<{ tokenCount: number }>`
    display: grid;
    z-index: 10;
    grid-gap: 12px;
    margin-top: 24px;
    margin-bottom: 12px;
    grid-template-columns: ${({ tokenCount }) => tokenCount === 2 ? '60px 60px' : '60px'};
    animation: rewardTokenFloat 4s ease-in-out infinite;

    @keyframes rewardTokenFloat {
        0% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(7.5px);
        }
        100% {
            transform: translateY(0px);
        }
    }

    ${({ theme }) => theme.mediaQueries.nav} {
        margin-top: -158px;
        margin-bottom: 126px;
    }
`

const RewardTokenGridItem = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`

const RewardTokenText = styled(Text)`
text-shadow: 1px 1px 2px black;
line-height: 14px;
`

export const ExpeditionRewardTokens: React.FC = memo(() => {
    const { summitRoundEmission, usdcRoundEmission } = useExpeditionRoundEmission()
    const rawSummitRoundEmission = getFormattedBigNumber(summitRoundEmission, 1, 18)
    const rawUsdcRoundEmission = getFormattedBigNumber(usdcRoundEmission, 1, 6)
    const summitEmitting = summitRoundEmission.isGreaterThan(0)
    const tokenCount = summitEmitting ? 2 : 1
    return (
        <RewardTokensGrid tokenCount={tokenCount}>
            { summitEmitting &&
                <RewardTokenGridItem>
                    <TokenSymbolImage symbol='SUMMIT' width={60} height={60}/>
                </RewardTokenGridItem>
            }
            <RewardTokenGridItem>
            <TokenSymbolImage symbol='USDC' width={60} height={60}/>
            </RewardTokenGridItem>
            { summitEmitting &&
                <RewardTokenGridItem>
                    <RewardTokenText monospace bold>{rawSummitRoundEmission}</RewardTokenText>
                    <RewardTokenText monospace small>SUMMIT</RewardTokenText>
                </RewardTokenGridItem>
            }
            <RewardTokenGridItem>
                <RewardTokenText monospace bold>{rawUsdcRoundEmission}</RewardTokenText>
                <RewardTokenText monospace small>USDC</RewardTokenText>
            </RewardTokenGridItem>
        </RewardTokensGrid>
    )
})
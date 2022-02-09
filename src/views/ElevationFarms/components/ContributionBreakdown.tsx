import React from 'react'
import styled from 'styled-components'
import { ElevationImage, Flex, Skeleton, Text, TokenSymbolImage } from 'uikit'

const BarHeight = 50

const ContributionWrapper = styled.div<{ perc: number, index: number }>`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: ${({ perc }) => perc}%;
    height: ${BarHeight}px;
    z-index: ${({ index }) => 10 - index};
`

const TitleWrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 32px;
    width: 100%;
    flex-wrap: wrap;
    /* overflow: hidden; */
`

const ValueText = styled(Text)<{ perc: number, index: number, isBonusVal?: boolean }>`
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    flex-wrap: wrap;
    overflow: hidden;
    bottom: ${({ isBonusVal }) => isBonusVal ? -14 : 0}px;
    display: ${({ isBonusVal, perc }) => isBonusVal && perc < 20 ? 'none' : 'block'};
    text-align: center;
    transform: ${({ perc }) => perc < 20 ? 'rotate(70deg) translateX(35%)' : 'none'};
    
    ${({ theme }) => theme.mediaQueries.nav} {
        display: ${({ isBonusVal, perc }) => isBonusVal && perc < 10 ? 'none' : 'block'};
        transform: ${({ perc }) => perc < 10 ? 'rotate(70deg) translateX(35%)' : 'none'};
    }
`

const LowPercHideText = styled(Text)<{ perc: number }>`
    display: ${({ perc }) => perc < 20 ? 'none' : 'flex'};

    ${({ theme }) => theme.mediaQueries.nav} {
        display: ${({ perc }) => perc < 10 ? 'none' : 'flex'};
    }
`

const VerticalBar = styled.div<{ perc: number, noContributions?: boolean }>`
    width: 1px;
    position: absolute;
    height: 20px;
    left: ${({ perc }) => perc}%;
    border-left: ${({ theme, noContributions }) => `1px ${noContributions === true ? 'dashed' : 'solid'} ${theme.colors.text}`};
`
const HorizontalBar = styled.div<{ noContributions?: boolean }>`
    position: absolute;
    width: 100%;
    height: 1px;
    border-top: ${({ theme, noContributions }) => `1px ${noContributions === true ? 'dashed' : 'solid'} ${theme.colors.text}`};
`

const Wrapper = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    gap: 6px;
`

const BarWrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 75px;
`

const NoBreakdownText = styled(Text)`
    background-color: ${({ theme }) => theme.colors.background};
    padding: 0px 6px;
    z-index: 2;
`

const ContributionSkeleton = styled(Skeleton)`
    position: relative;
    width: 100%;
    height: 4px;
    min-height: 4px;
`




interface Contribution {
    token?: boolean
    elevation?: boolean
    title?: string
    val?: string
    bonusVal?: string
    key: number
    perc: number
    index?: number
}

const ContributionComponent: React.FC<Contribution> = ({token = false, elevation = false, title, val, bonusVal, perc, index}) => {
    return <ContributionWrapper perc={perc} index={index}>
        {title != null && <TitleWrapper>
            { token && <TokenSymbolImage symbol={title} width={36} height={36} />}
            { elevation && <ElevationImage elevation={title} width={36} height={36} />}
            <LowPercHideText monospace perc={perc} lineHeight='14px' ml='4px' mr='4px' small textAlign='center'>{title}</LowPercHideText>
        </TitleWrapper>}
        <VerticalBar perc={100}/>
        <ValueText monospace bold perc={perc} index={index}>{val != null ? val : `${perc}%`}</ValueText>
        { bonusVal != null && <ValueText monospace bold gold isBonusVal perc={perc} index={index}>{bonusVal}</ValueText> }
    </ContributionWrapper>
}

interface Props {
    loaded: boolean
    breakingDownTitle: string
    breakdownType?: 'ELEVATION' | 'FARM'
    contributions: Contribution[]
}

const ContributionBreakdown: React.FC<Props> = ({loaded, breakingDownTitle, breakdownType = 'ELEVATION', contributions}) => {
    const noContributions = contributions.length === 0

    return (
        <Wrapper>
            <Text bold monospace>{breakingDownTitle} BY {breakdownType}:</Text>
            <BarWrapper>
                { !loaded ?
                    <>
                        <ContributionSkeleton/>
                    </> :
                    <>
                        <VerticalBar perc={0} noContributions={noContributions}/>
                        <HorizontalBar noContributions={noContributions}/>
                        {noContributions ?
                            <>
                                <NoBreakdownText monospace>NO {breakingDownTitle} TO BREAKDOWN</NoBreakdownText>
                                <VerticalBar perc={100} noContributions/>
                            </> :
                            contributions.map((contribution, index) => 
                                <ContributionComponent key={contribution.key} index={index} {...contribution} />
                            )
                        }
                    </>
                }
            </BarWrapper>
        </Wrapper>
    )
}

export default React.memo(ContributionBreakdown)

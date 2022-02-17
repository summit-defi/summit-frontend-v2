import { Elevation } from 'config/constants'
import { linearGradient } from 'polished'
import React from 'react'
import { useSceneryScreenshot } from 'state/hooksNew'
import styled from 'styled-components'
import { elevationPalette } from 'theme/colors'
import { ElevationImage, Flex, Skeleton, Text } from 'uikit'
import { getPaletteGradientStops } from 'utils'

const BarHeight = 64

const ContributionWrapper = styled.div<{ perc: number, maxPerc?: number, index: number }>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: ${({ perc, maxPerc }) => 50 * (perc / (maxPerc||100))}%;
    height: ${BarHeight}px;
    z-index: ${({ index }) => 10 - index};
`

const TitleWrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -18px;
    width: 100%;
    flex-wrap: wrap;
    /* overflow: hidden; */
`

const LowPercHideText = styled(Text)<{ perc: number }>`
    display: ${({ perc }) => perc < 20 ? 'none' : 'flex'};

    ${({ theme }) => theme.mediaQueries.nav} {
        display: ${({ perc }) => perc < 10 ? 'none' : 'flex'};
    }
`

const HorizontalBar = styled.div<{ noContributions?: boolean, elevation?: string }>`
    width: 100%;
    height: 24px;
    border-radius: 12px 0px 12px 0px;
    background: ${({ theme, elevation }) => elevation == null ? theme.colors.text : linearGradient({
        colorStops: getPaletteGradientStops(elevation as Elevation, true),
        toDirection: '120deg',
    })};
    box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.textShadow};
`

const Wrapper = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    gap: 6px;
`

const BarWrapper = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 95px;
    gap: 6px;
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
    title?: string
    val?: string
    key: number
    perc: number
    index?: number
}

const ContributionComponent: React.FC<Contribution & { screenshot: boolean, maxPerc?: number }> = ({title, screenshot, val, perc, index, maxPerc}) => {
    return <ContributionWrapper perc={perc} maxPerc={maxPerc} index={index}>
        <ElevationImage elevation={title} width={36} height={36} />
        <HorizontalBar elevation={title}/>
        <Text monospace bold>{(val != null && !screenshot) ? val : `${perc.toFixed(1)}%`}</Text>
    </ContributionWrapper>
}

interface Props {
    loaded: boolean
    contributions: Contribution[]
}

const StakingBreakdown: React.FC<Props> = ({loaded, contributions}) => {
    const noContributions = contributions.length === 0
    const screenshot = useSceneryScreenshot()
    const maxPerc = contributions.reduce((max, contrib) => Math.max(max, contrib.perc), 0)
    console.log({
        maxPerc
    })

    return (
        <Wrapper>
            <Text bold monospace>STAKING STRATEGY:</Text>
            <BarWrapper>
                { !loaded ?
                    <>
                        <ContributionSkeleton/>
                    </> :
                    <>
                        {noContributions ?
                            <>
                                <NoBreakdownText monospace>NO STAKING STRATEGY</NoBreakdownText>
                            </> :
                            contributions.map((contribution, index) => 
                                <ContributionComponent key={contribution.key} maxPerc={maxPerc} screenshot={screenshot} index={index} {...contribution} />
                            )
                        }
                    </>
                }
            </BarWrapper>
        </Wrapper>
    )
}

export default React.memo(StakingBreakdown)

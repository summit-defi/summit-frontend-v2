import { Elevation } from 'config/constants'
import { linearGradient } from 'polished'
import React from 'react'
import { useSceneryScreenshot } from 'state/hooksNew'
import styled from 'styled-components'
import { elevationPalette } from 'theme/colors'
import { ElevationImage, Flex, Skeleton, Text } from 'uikit'
import { getPaletteGradientStops } from 'utils'

const BarHeight = 64

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
    top: -18px;
    width: 100%;
    flex-wrap: wrap;
    /* overflow: hidden; */
`

const ValueText = styled(Text)<{ perc: number, index: number, isTotem?: boolean, isBonusVal?: boolean }>`
    position: absolute;
    font-size: 14px;
    line-height: 18px;
    height: 18px;
    width: ${({ isTotem }) => isTotem ? '40px': 'auto'};
    flex-wrap: wrap;
    overflow: hidden;
    bottom: ${({ isBonusVal }) => isBonusVal ? -14 : 0}px;
    display: ${({ isBonusVal, perc }) => isBonusVal && perc < 20 ? 'none' : 'block'};
    text-align: center;
    transform: ${({ perc }) => perc < 20 ? 'rotate(70deg) translateX(35%)' : 'none'};
    
    ${({ theme }) => theme.mediaQueries.nav} {
        display: ${({ isBonusVal, perc }) => isBonusVal && perc < 10 ? 'none' : 'block'};
        transform: ${({ perc }) => perc < 11 ? 'rotate(70deg) translateX(25%)' : 'none'};
    }
`

const LowPercHideText = styled(Text)<{ perc: number }>`
    display: ${({ perc }) => perc < 20 ? 'none' : 'flex'};

    ${({ theme }) => theme.mediaQueries.nav} {
        display: ${({ perc }) => perc < 10 ? 'none' : 'flex'};
    }
`

const HorizontalBar = styled.div<{ noContributions?: boolean, elevation?: string }>`
    position: absolute;
    width: calc(100% - 4px);
    height: 20px;
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
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 95px;
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

const ContributionComponent: React.FC<Contribution & { screenshot: boolean }> = ({title, screenshot, val, perc, index}) => {
    return <ContributionWrapper perc={perc} index={index}>
        <TitleWrapper>
            <ElevationImage elevation={title} width={36} height={36} />
            <LowPercHideText monospace bold fontSize='14px' perc={perc} lineHeight='14px' ml='4px' mr='4px' small textAlign='center'>{title}</LowPercHideText>
        </TitleWrapper>
        <HorizontalBar elevation={title}/>
        <ValueText monospace bold perc={perc} index={index}>{(val != null && !screenshot) ? val : `${perc.toFixed(1)}%`}</ValueText>
    </ContributionWrapper>
}

interface Props {
    loaded: boolean
    contributions: Contribution[]
}

const StakingBreakdown: React.FC<Props> = ({loaded, contributions}) => {
    const noContributions = contributions.length === 0
    const screenshot = useSceneryScreenshot()

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
                                <ContributionComponent key={contribution.key} screenshot={screenshot} index={index} {...contribution} />
                            )
                        }
                    </>
                }
            </BarWrapper>
        </Wrapper>
    )
}

export default React.memo(StakingBreakdown)

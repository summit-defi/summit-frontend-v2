import { Elevation } from 'config/constants'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { transparentize } from 'polished'
import { Flex, Skeleton, Text } from 'uikit'

const BarHeight = 24

const elevationBarBorder = ({ theme, elevation, focused }: { theme: DefaultTheme, elevation?: Elevation, focused?: Elevation }): string => {
    if (elevation == null) return `
        border: 1px dashed ${theme.colors.text};
        background-color: transparent;
    `
    if (focused != null && elevation !== focused) return `
        background-color: ${transparentize(0.4, theme.colors[elevation])};
    `
    return `
        border: none;
        background-color: ${theme.colors[elevation]};
    `
}

const ElevationBar = styled.div<{ elevation?: Elevation, perc: number, focused?: Elevation }>`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: ${({ perc }) => `calc(${perc}% - 2px)`};
    height: ${({ focused, elevation }) => focused != null && focused === elevation ? BarHeight + 4 : BarHeight}px;
    margin-left: 1px;
    margin-right: 1px;
    ${elevationBarBorder}
`

const ElevationBarSkeleton = styled(Skeleton)`
    position: relative;
    width: 100%;
    height: ${BarHeight}px;
`

const ElevationText = styled(Text)<{ elevation?: Elevation, focused?: Elevation }>`
    font-size: 13px;
    color: white;
    /* display: ${({ elevation, focused }) => focused != null && elevation !== focused ? 'none' : 'default'}; */
    font-weight: bold;
`

const ValueText = styled(Text)`
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    flex-wrap: wrap;
    overflow: hidden;
    bottom: -18px;
    text-align: center;
`

const Wrapper = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
`

const BarWrapper = styled(Flex)<{ hasTitle: boolean, center: boolean }>`
    flex-direction: row;
    align-items: ${({ center }) => center ? 'center' : 'flex-start' };
    justify-content: center;
    position: relative;
    width: 100%;
    height: 40px;
    margin-top: ${({ hasTitle }) => hasTitle ? 8 : 0}px;

    > * {
        &:first-child {
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
        }
        &:last-child {
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
        }
    }
`




interface Contribution {
    elevation?: Elevation
    val?: string
    key: number
    perc: number
}
interface ContFocused {
    focused?: Elevation
}

const ContributionComponent: React.FC<Contribution & ContFocused> = ({elevation, val, perc, focused}) => {
    return <ElevationBar perc={perc} elevation={elevation} focused={focused}>
        <ElevationText monospace small elevation={elevation} focused={focused}>{elevation}</ElevationText>
        { (focused == null || focused === elevation) &&
            <ValueText monospace bold>{val != null ? val : `${perc.toFixed(1)}%`}</ValueText>
        }
    </ElevationBar>
}

interface Props {
    loaded: boolean
    title?: string
    focused?: Elevation
    contributions: Contribution[]
    center?: boolean
}

const ElevationContributionBreakdown: React.FC<Props> = ({ loaded, title, contributions, focused, center = false}) => {
    return (
        <Wrapper>
            { title != null && <Text bold monospace>{title}</Text> }
            <BarWrapper hasTitle={title != null} center={center}>
                { !loaded ?
                    <ElevationBarSkeleton/> :
                    contributions.length === 0 ?
                        <ElevationBar perc={100}/> :
                        contributions.map((contribution) => 
                            <ContributionComponent key={contribution.key} {...contribution} focused={focused} />
                        )
                }
            </BarWrapper>
        </Wrapper>
    )
}

export default React.memo(ElevationContributionBreakdown)

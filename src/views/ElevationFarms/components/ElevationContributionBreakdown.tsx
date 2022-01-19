import { Elevation } from 'config/constants'
import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Flex, Text } from 'uikit'

const BarHeight = 24

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
    background-color: ${({ theme, elevation }) => elevation == null ? theme.colors.text : darken(0, theme.colors[elevation])};
    /* filter: ${({ focused, elevation }) => focused == null || focused === elevation ? 'none' : 'grayscale(1)'}; */
    opacity: ${({ focused, elevation }) => elevation == null ? 0.1 : (focused == null || focused === elevation) ? 1 : 0.5};
  
`

const ElevationText = styled(Text)`
    font-size: 12px;
    color: white;
    text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
`

const TitleWrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 36px;
    top: -16px;
    width: 100%;
    gap: 4px;
    flex-wrap: wrap;
    overflow: hidden;
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

const MarkerText = styled(Text)`
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    padding-left: 6px;
    padding-right: 6px;
    top: ${BarHeight - 18}px;
    bottom: 0px;
    background-color: ${({ theme }) => theme.colors.background};
`

const MarkerBar = styled.div<{ elevation?: Elevation }>`
    width: 6px;
    position: absolute;
    top: 15px;
    bottom: 15px;
    left: -3px;
    border-radius: 3px;
    background-color: ${({ theme, elevation }) => darken(0.1, theme.colors[elevation || 'BASE'])};
    box-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
`

const VerticalBar = styled.div<{ perc: number }>`
    width: 1px;
    position: absolute;
    height: 20px;
    background-color: ${({ theme }) => theme.colors.text};
    left: ${({ perc }) => perc}%;
`

const BarFlex = styled(Flex)`
    position: relative;
    margin-left: 30px;
    margin-right: 30px;
    flex-direction: row;
    align-items: center;
    flex: 1;
`
const HorizontalBar = styled.div`
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.text};
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
        <ElevationText monospace bold fontSize='12px'>{elevation}</ElevationText>
        { (focused == null || focused === elevation) &&
            <ValueText monospace bold>{val != null ? val : `${perc.toFixed(1)}%`}</ValueText>
        }
    </ElevationBar>
}

interface Props {
    title?: string
    focused?: Elevation
    contributions: Contribution[]
    center?: boolean
}

const ElevationContributionBreakdown: React.FC<Props> = ({title, contributions, focused, center = false}) => {
  return (
    <Wrapper>
        { title != null && <Text bold monospace>{title}</Text> }
        <BarWrapper hasTitle={title != null} center={center}>
            {contributions.map((contribution) => 
                <ContributionComponent key={contribution.key} {...contribution} focused={focused} />
            )}
            {contributions.length === 0 &&
                <ElevationBar perc={100}/>
            }
        </BarWrapper>
    </Wrapper>
  )
}

export default React.memo(ElevationContributionBreakdown)

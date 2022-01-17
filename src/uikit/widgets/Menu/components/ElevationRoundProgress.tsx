import React from 'react'
import styled, { css } from 'styled-components'
import { grayscale, transparentize } from 'polished'
import Flex from 'uikit/components/Box/Flex'
import { Text } from 'uikit/components/Text'
import { useElevationRoundTimeRemaining, useSelectedElevation } from 'state/hooks'
import { Elevation } from 'config/constants'

const RoundProgressBar = styled(Flex)<{ timedElevation: boolean }>`
    position: absolute;
    bottom: 0px;
    width: 150%;
    max-width: calc(100vw - 40px);
    filter: ${({ timedElevation }) => timedElevation ? '' : 'grayscale(1) '}drop-shadow(1px 1px 1px ${transparentize(0.5, 'black')});
    opacity: ${({ timedElevation }) => timedElevation ? 1 : 0.75};
`

const HorizontalBar = styled.div`
    position: absolute;
    width: 100%;
    height: 4px;
    top: -2px;
    background-color: ${({ theme }) => theme.colors.text};
    `

const VerticalBar = styled.div<{ right?: boolean }>`
    position: absolute;
    top: -7px;
    height: 14px;
    width: 4px;
    border-radius: 4px;
    z-index: 4;
    
    ${({ right }) => right ? css`
        right: 0px;
        background-color: ${({ theme }) => theme.colors.text};
        ` : css`
        left: 0px;
        background-color: ${({ theme }) => theme.colors.textGold};
    `}
`

const ProgressBar = styled.div<{ perc: number }>`
    width: ${({ perc }) => perc}%;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.textGold};
    border-radius: 0px 3px 3px 0px;
    z-index: 3;
    position: absolute;
    left: 0px;
    top: -2px;
`

const ProgressPill = styled.div<{ perc: number }>`
    width: 14px;
    height: 14px;
    transform: rotate(-45deg);
    background-color: ${({ theme }) => theme.colors.textGold};
    border-radius: 10px 10px 10px 0px;
    z-index: 3;
    position: absolute;
    left: ${({ perc }) => `calc(${perc}% - 6px)`};
    top: -7px;
`

const TextBubble = styled.div<{ perc: number }>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 16px;
    background-color: ${({ theme }) => theme.colors.card};
    border-radius: 4px;
    z-index: 3;
    position: absolute;
    left: ${({ perc }) => perc}%;
    transform: translateX(-50%) translateY(50%);
    bottom: -26px;
`

const ElevationRoundProgress: React.FC = () => {
    const perc = 20
    const elevation = useSelectedElevation()
    const timedElevation = [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT].includes(elevation)
    const roundTimeRemaining = useElevationRoundTimeRemaining(Elevation.PLAINS)
    


    return (
        <RoundProgressBar timedElevation={timedElevation}>
            <HorizontalBar/>
            <VerticalBar/>
            <VerticalBar right/>
            <ProgressBar perc={perc}/>
            <ProgressPill perc={perc}/>
            <TextBubble perc={perc}>
                <Text bold monospace>1H 30M</Text>
            </TextBubble>
        </RoundProgressBar>
    )
}

export default React.memo(ElevationRoundProgress)

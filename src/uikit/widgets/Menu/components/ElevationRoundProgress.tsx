import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { grayscale, linearGradient, transparentize } from 'polished'
import Flex from 'uikit/components/Box/Flex'
import { Text } from 'uikit/components/Text'
import { useElevationRoundTimeRemaining, useSelectedElevation } from 'state/hooks'
import { Elevation } from 'config/constants'
import { getElevationGradientStops, getTimeRemainingText } from 'utils'
import { clamp } from 'lodash'

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
    background-color: ${({ theme }) => linearGradient({
        colorStops: getElevationGradientStops('GOLD'),
        toDirection: '120deg',
    })};
    border-radius: 0px 3px 3px 0px;
    z-index: 3;
    position: absolute;
    left: 0px;
    top: -2px;
`

const ProgressPill = styled.div<{ perc: number }>`
    width: 14px;
    height: 14px;
    transform: rotate(${({ perc }) => perc === 100 ? '45' : '-45'}deg);
    background-color: #EA9130;
    border-radius: 10px 10px 10px 0px;
    position: absolute;
    left: ${({ perc }) => `calc(${perc}% - ${perc * 0.02}px - 7px)`};
    top: -7px;
    z-index: 4;
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
    white-space: nowrap;
`

const ElevationRoundProgress: React.FC = () => {
    const elevation = useSelectedElevation()
    const timedElevation = [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT].includes(elevation)
    const roundTimeRemaining = useElevationRoundTimeRemaining(Elevation.PLAINS)

    const getTimerText = useCallback(
        () => {
            if (roundTimeRemaining === 0) {
                return 'FINALIZING ROUND'
            }
            if (roundTimeRemaining <= 120) {
                return `ROUND LOCKED - ${getTimeRemainingText(roundTimeRemaining)}`
            }
        
            return getTimeRemainingText(roundTimeRemaining - 120)
        },
        [roundTimeRemaining]
    )

    const perc = useCallback(
        () => ({
            pill: clamp(0, 100, roundTimeRemaining / (7200 - 120)),
            text: 50
        }),
        [roundTimeRemaining]
    )

    return (
        <RoundProgressBar timedElevation={timedElevation}>
            <HorizontalBar/>
            <VerticalBar/>
            <VerticalBar right/>
            <ProgressBar perc={perc().pill}/>
            <ProgressPill perc={perc().pill}/>
            <TextBubble perc={perc().text}>
                <Text bold monospace>{getTimerText()}</Text>
            </TextBubble>
        </RoundProgressBar>
    )
}

export default React.memo(ElevationRoundProgress)

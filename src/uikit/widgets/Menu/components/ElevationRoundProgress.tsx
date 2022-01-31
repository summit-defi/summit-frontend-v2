import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { linearGradient, transparentize } from 'polished'
import Flex from 'uikit/components/Box/Flex'
import { Text } from 'uikit/components/Text'
import { useElevationFarmsTab, useElevationRoundTimeRemaining, useSelectedElevation } from 'state/hooks'
import { Elevation, ElevationFarmTab, SummitPalette } from 'config/constants'
import { getPaletteGradientStops, getTimeRemainingText } from 'utils'
import { clamp } from 'lodash'
import { Spinner, SpinnerKeyframes } from 'uikit/components/Svg/Icons/Spinner'

const RoundProgressBar = styled(Flex)<{ greyed: boolean }>`
    position: absolute;
    bottom: 3px;
    width: 150%;
    max-width: calc(100vw - 40px);
    filter: ${({ greyed }) => greyed ? 'grayscale(1) ' : ''}drop-shadow(1px 1px 1px ${transparentize(0.5, 'black')});
    opacity: ${({ greyed }) => greyed ? 0.75 : 1};
`

const HorizontalBar = styled.div`
    position: absolute;
    width: 100%;
    height: 4px;
    top: -2px;
    background-color: ${({ theme }) => theme.colors.text};
`

const VerticalBar = styled.div<{ right?: boolean, isExpedition: boolean }>`
    position: absolute;
    top: -7px;
    height: 14px;
    width: 4px;
    border-radius: 4px;
    z-index: 4;
    
    ${({ right, isExpedition }) => right ? css`
        right: 0px;
        background-color: ${({ theme }) => theme.colors.text};
        ` : css`
        left: 0px;
        background-color: ${({ theme }) => isExpedition ? '#3B2F60' : theme.colors.textGold};
    `}
`

const ProgressBar = styled.div<{ perc: number, isExpedition: boolean }>`
    width: ${({ perc }) => perc}%;
    height: 4px;
    background-color: ${({ isExpedition }) => linearGradient({
        colorStops: getPaletteGradientStops(isExpedition ? SummitPalette.EXPEDITION : SummitPalette.GOLD),
        toDirection: '120deg',
    })};
    border-radius: 0px 3px 3px 0px;
    z-index: 3;
    position: absolute;
    left: 0px;
    top: -2px;
`

const ProgressPill = styled.div<{ perc: number, isExpedition: boolean }>`
    width: 14px;
    height: 14px;
    transform: rotate(${({ perc }) => perc === 100 ? '45' : '-45'}deg);
    background-color: ${({ isExpedition }) => isExpedition ? '#DDA4A8' : '#f2ac4a'};
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
    left: ${({ perc }) => `clamp(33px, calc(${perc}% - 2px), calc(100% - 33px))`};
    transform: translateX(-50%) translateY(50%);
    bottom: -26px;
    white-space: nowrap;

    ${({ theme }) => theme.mediaQueries.nav} {
        left: ${({ perc }) => `calc(${perc}% - 2px)`};
    }

    .spinner {
        fill: #f2ac4a;
        stroke: #f2ac4a;
        stroke-width: 2px;
        animation: ${SpinnerKeyframes} 1.4s infinite linear;
        margin-right: 18px;
    }
`

const TimerText = styled(Text)<{ even: boolean, endingHighlight: boolean }>`
    transform-origin: 50% 50%;
    transform: ${({ even }) => `scale(${even ? 1.07 : 1})`};
    color: ${({ theme, endingHighlight, even }) => (endingHighlight && even) ? '#f2ac4a' : theme.colors.text};
`

const StyledSpinner = styled(Spinner)`
    width: 14px;
    height: 14px;
`

const ElevationRoundProgress: React.FC = () => {
    const elevation = useSelectedElevation()
    const isExpedition = elevation === Elevation.EXPEDITION
    const elevationTab = useElevationFarmsTab()
    const roundDuration = (isExpedition ? 24 : 2) * 3600
    const roundTimeRemaining = useElevationRoundTimeRemaining(isExpedition ? Elevation.EXPEDITION : Elevation.PLAINS)

    const getTimerText = useCallback(
        () => {
            if (roundTimeRemaining == null) return ''
            if (roundTimeRemaining === 0) return 'FINALIZING ROUND'
            if (roundTimeRemaining <= 120) {
                return `LOCKED, FINALIZING IN: ${getTimeRemainingText(roundTimeRemaining)}`
            }
            if (roundTimeRemaining <= 420) return `ROUND LOCKS IN: ${getTimeRemainingText(roundTimeRemaining - 120)}!`
        
            return getTimeRemainingText(roundTimeRemaining - 120)
        },
        [roundTimeRemaining]
    )

    const perc = useCallback(
        () => {
            const pill = clamp((100 * ((roundDuration - 120) - (roundTimeRemaining - 120))) / (roundDuration - 120), 0, 100)
            return {
                pill,
                text: roundTimeRemaining <= 420 ? 50 : pill
            }
        },
        [roundTimeRemaining, roundDuration]
    )

    return (
        <RoundProgressBar greyed={elevationTab === ElevationFarmTab.OASIS}>
            <HorizontalBar/>
            <VerticalBar isExpedition={isExpedition}/>
            <VerticalBar isExpedition={isExpedition} right/>
            <ProgressBar isExpedition={isExpedition} perc={perc().pill}/>
            <ProgressPill isExpedition={isExpedition} perc={perc().pill}/>
            { roundTimeRemaining != null && <TextBubble perc={perc().text}>
                { roundTimeRemaining === 0 && <StyledSpinner className="spinner" /> }
                <TimerText bold monospace endingHighlight={roundTimeRemaining === 0 || roundTimeRemaining <= 420 && roundTimeRemaining > 120} even={roundTimeRemaining % 2 === 0}>{getTimerText()}</TimerText>
            </TextBubble> }
        </RoundProgressBar>
    )
}

export default React.memo(ElevationRoundProgress)

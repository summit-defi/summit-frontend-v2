import React, { useCallback } from 'react'
import styled from 'styled-components'
import { linearGradient, transparentize } from 'polished'
import Flex from 'uikit/components/Box/Flex'
import { Text } from 'uikit/components/Text'
import { useElevationFarmsTab, useSelectedElevation } from 'state/hooks'
import { Elevation, ElevationFarmTab, RoundLockTime, SummitPalette } from 'config/constants'
import { getPaletteGradientStops, getTimeRemainingText } from 'utils'
import { clamp } from 'lodash'
import { Spinner, SpinnerKeyframes } from 'uikit/components/Svg/Icons/Spinner'
import { RoundStatus, useElevationRoundStatusAndProgress } from 'state/hooksNew'

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

const VerticalBar = styled.div<{ right?: boolean, isExpedition: boolean, isUnlockBar: boolean }>`
    position: absolute;
    top: -7px;
    height: 14px;
    width: 4px;
    border-radius: 4px;
    z-index: 4;
    
    right: ${({ right }) => right ? '0px' : 'unset'};
    left: ${({ right }) => right ? 'unset' : '0px'};
    background-color: ${({ right, isExpedition, theme, isUnlockBar }) => ((!right && !isUnlockBar) || (right && isUnlockBar)) ?
        (isExpedition ? '#3B2F60' : theme.colors.textGold) :
        theme.colors.text
    };
`

const ProgressBar = styled.div<{ perc: number, isExpedition: boolean, isUnlockBar: boolean }>`
    width: ${({ perc, isUnlockBar }) => isUnlockBar ? (100 - perc) : perc}%;
    height: 4px;
    background-color: ${({ isExpedition, isUnlockBar }) => linearGradient({
        colorStops: getPaletteGradientStops(isExpedition ? SummitPalette.EXPEDITION : SummitPalette.GOLD),
        toDirection: isUnlockBar ? '-60deg' : '120deg',
    })};
    border-radius: 0px 3px 3px 0px;
    z-index: 3;
    position: absolute;
    left: ${({ isUnlockBar }) => isUnlockBar ? 'unset' : '0px'};
    right: ${({ isUnlockBar }) => isUnlockBar ? '0px' : 'unlock'};
    top: -2px;
`

const ProgressPill = styled.div<{ perc: number, isExpedition: boolean }>`
    width: 14px;
    height: 14px;
    transform: rotate(${({ perc }) => perc === 100 ? '45' : '-45'}deg);
    background-color: ${({ isExpedition }) => isExpedition ? '#DDA4A8' : '#EA9130'};
    border-radius: 10px 10px 10px 0px;
    position: absolute;
    left: ${({ perc }) => `calc(${perc}% - ${perc * 0.02}px - 7px)`};
    top: -7px;
    z-index: 4;
`

const TextBubble = styled.div<{ perc: number, isExpedition: boolean }>`
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
        fill: ${({ isExpedition }) => isExpedition ? '#d89595' : '#f2ac4a'};
        stroke: ${({ isExpedition }) => isExpedition ? '#d89595' : '#f2ac4a'};
        stroke-width: 2px;
        animation: ${SpinnerKeyframes} 1.4s infinite linear;
        margin-right: 18px;
    }
`

const TimerText = styled(Text)<{ evenGrowHighlight: boolean, endingHighlight: boolean, isExpedition: boolean }>`
    transform-origin: 50% 50%;
    transform: ${({ evenGrowHighlight }) => `scale(${(evenGrowHighlight) ? 1.07 : 1})`};
    color: ${({ theme, endingHighlight, evenGrowHighlight, isExpedition }) => (endingHighlight && evenGrowHighlight) ? (isExpedition ? '#d89595' : '#f2ac4a') : theme.colors.text};
`

const StyledSpinner = styled(Spinner)`
    width: 14px;
    height: 14px;
`

const ElevationRoundProgress: React.FC = () => {
    const elevationTab = useElevationFarmsTab()
    const selectedElevation = useSelectedElevation()
    const elevation = selectedElevation || Elevation.OASIS
    const isExpedition = elevation === Elevation.EXPEDITION

    const { status, duration, timeRemaining } = useElevationRoundStatusAndProgress(elevation)
    const isUnlockBar = status === RoundStatus.NotYetUnlocked

    const getRoundProgressUI = useCallback(
        () => {
            let timerText = ''
            let nearLockHighlight = true
            const durationToLock = duration - RoundLockTime
            const timeToLock = timeRemaining - RoundLockTime
            const pillPerc = clamp((100 * (durationToLock - timeToLock)) / durationToLock, 0, 100)
            let evenGrowHighlight = false
            let textPerc = 50
            if (isUnlockBar) {
                nearLockHighlight = false
                timerText = `THE ${elevation} UNLOCKS IN: ${getTimeRemainingText(timeRemaining)}`
            } else {
                // eslint-disable-next-line no-lonely-if
                if (timeRemaining == null) {
                    timerText = ''
                    nearLockHighlight = false
                } else if (timeRemaining === 0) {
                    timerText = 'FINALIZING ROUND'
                    evenGrowHighlight = true
                } else if (timeRemaining <= RoundLockTime) {
                    timerText = `LOCKED, FINALIZING IN: ${getTimeRemainingText(timeRemaining)}`
                    evenGrowHighlight = true
                } else if (timeRemaining <= (RoundLockTime + 300)) {
                    timerText = `ROUND LOCKS IN: ${getTimeRemainingText(timeToLock)}!`
                    evenGrowHighlight = timeRemaining % 2 === 0
                } else {
                    timerText = getTimeRemainingText(timeToLock)
                    textPerc = pillPerc
                    nearLockHighlight = false
                }                
            }

            return {
                timerText,
                nearLockHighlight,
                pillPerc,
                textPerc,
                evenGrowHighlight
            }

        },
        [timeRemaining, isUnlockBar, duration, elevation]
    )

    const {
        timerText,
        nearLockHighlight,
        pillPerc,
        textPerc,
        evenGrowHighlight,
    } = getRoundProgressUI()

    return (
        <RoundProgressBar greyed={elevationTab === ElevationFarmTab.OASIS}>
            <HorizontalBar/>
            <VerticalBar isExpedition={isExpedition} isUnlockBar={isUnlockBar}/>
            <VerticalBar isExpedition={isExpedition} isUnlockBar={isUnlockBar} right/>
            <ProgressBar isExpedition={isExpedition} perc={pillPerc} isUnlockBar={isUnlockBar}/>
            <ProgressPill isExpedition={isExpedition} perc={pillPerc}/>
            { timeRemaining != null && <TextBubble isExpedition={isExpedition} perc={textPerc}>
                { timeRemaining === 0 && <StyledSpinner className="spinner" /> }
                <TimerText
                    isExpedition={isExpedition}
                    bold
                    monospace
                    endingHighlight={nearLockHighlight}
                    evenGrowHighlight={evenGrowHighlight}
                >
                    {timerText}
                </TimerText>
            </TextBubble> }
        </RoundProgressBar>
    )
}

export default React.memo(ElevationRoundProgress)

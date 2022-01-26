import React, { useState } from 'react'
import { Flex, Text } from 'uikit'
import Slider from 'rc-slider'
import styled from 'styled-components'
import { darken, linearGradient, transparentize } from 'polished'
import 'rc-slider/assets/index.css'
import { pressableMixin } from 'uikit/util/styledMixins'
import { getPaletteGradientStops, getLockDurationPerc, lockDurationSliderMarks, lockDurationSliderPerc, sliderPercLockDuration, sliderPoints  } from 'utils'
import { SummitPalette } from 'config/constants'

const ButtonHeight = 6

const SliderWrapper = styled(Flex)`
    position: relative;
    width: calc(100% - 48px);
    margin-top: 28px;
    margin-bottom: 26px;
    pointer-events: none;

    .rc-slider-rail {
        width: calc(100% + ${ButtonHeight}px);
        left: -${ButtonHeight / 2}px;
        height: ${ButtonHeight}px;
        border-radius: ${ButtonHeight / 2}px;
        top: ${(ButtonHeight / -2) + 6}px;
        background-color: ${({ theme }) => darken(0.2, theme.colors.background)};
    }
    .rc-slider-track {
        display: none;
    }
    .rc-slider-dot {
        display: none;        
    }
    .rc-slider-dot-active {
        border-color: none;
    }

    .rc-slider-handle {
        width: ${ButtonHeight - 4}px;
        height: ${ButtonHeight - 4}px;
        padding: 0px;
        border: none;
        margin-top: -${(ButtonHeight / 2) - 3}px;
        background: transparent;
        z-index: 5;
    }
    .rc-slider-handle:hover {
        box-shadow: none;
    }
    .rc-slider-handle:active {
        box-shadow: none;
    }

    .rc-slider-mark {
        top: -24px;
        pointer-events: none;
    }
    .rc-slider-mark-text {
        color: ${({ theme }) => theme.colors.text};
        font-family: Courier Prime, monospace;
        letter-spacing: 0.5px;
        font-weight: bold;
        pointer-events: none;
    }
`

const FakeMarkDot = styled.div<{ perc: number }>`
    position: absolute;
    left: ${({ perc }) => perc}%;
    width: 32px;
    height: 64px;
    margin-left: -16px;
    top: -26px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 4;

    &::after {
        position: absolute;
        border-radius: 4px;
        content: ' ';
        width: 6px;
        height: 6px;
        background-color: ${({ theme }) => theme.colors.text};
    }
`

const FakeSliderHandle = styled.div<{ perc: number }>`
    position: absolute;
    left: ${({ perc }) => perc}%;
    width: 24px;
    height: 24px;
    padding: 0px;
    border: none;
    pointer-events: none;

    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
    margin-top: -6px;
    z-index: 6;
    background: ${linearGradient({
        colorStops: getPaletteGradientStops(SummitPalette.EVEREST),
        toDirection: '120deg',
    })};
    border-radius: 20px;
`

interface Props {
    avgLockDuration: number | null
}

const EverestLockDurationIndicator: React.FC<Props> = ({ avgLockDuration }) => {
    const marks = lockDurationSliderMarks()
    const avgPerc = getLockDurationPerc(avgLockDuration)
    const filterPercs = [0, 3, 8].map((index) => index * (100 / (sliderPoints.length - 1)))

    const filteredMarks = {
        [filterPercs[0]]: marks[filterPercs[0]],
        [filterPercs[1]]: marks[filterPercs[1]],
        [filterPercs[2]]: marks[filterPercs[2]],
    }

    return (
        <SliderWrapper>
            <Slider
                min={0}
                marks={filteredMarks}
                step={null}
                defaultValue={0}
            />
            { Object.keys(filteredMarks).map((markPerc) =>
                <FakeMarkDot
                    key={markPerc}
                    perc={parseFloat(markPerc)}
                />
            )}
            { avgPerc != null &&
                <FakeSliderHandle perc={avgPerc}/>
            }
        </SliderWrapper>
    )
}

export default EverestLockDurationIndicator
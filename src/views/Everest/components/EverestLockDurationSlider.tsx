import React, { useState } from 'react'
import { Flex } from 'uikit'
import Slider from 'rc-slider'
import styled from 'styled-components'
import { darken, linearGradient } from 'polished'
import 'rc-slider/assets/index.css'
import { pressableMixin } from 'uikit/util/styledMixins'
import { getPaletteGradientStops, lockDurationSliderMarks, lockDurationSliderPerc, sliderPercLockDuration, sliderPoints  } from 'utils'
import { SummitPalette } from 'config/constants'

const ButtonHeight = 28

const SliderWrapper = styled(Flex)`
    position: relative;
    width: calc(100% - ${ButtonHeight}px);
    margin-top: 28px;
    margin-bottom: 26px;

    .rc-slider-rail {
        width: calc(100% + ${ButtonHeight}px);
        left: -${ButtonHeight / 2}px;
        height: ${ButtonHeight}px;
        border-radius: ${ButtonHeight / 2}px;
        top: ${(ButtonHeight / -2) + 6}px;
        background-color: ${({ theme }) => darken(0.1, theme.colors.background)};
        box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
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

const FakeMarkDot = styled.div<{ perc: number, disabled: boolean }>`
    transition: transform 0.2s;
    position: absolute;
    left: ${({ perc }) => perc}%;
    width: 32px;
    height: 64px;
    margin-left: -16px;
    top: -26px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
    ${pressableMixin}

    &::after {
        position: absolute;
        border-radius: 4px;
        content: ' ';
        width: 6px;
        height: 6px;
        background-color: ${({ theme }) => theme.colors.text};
        box-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
    }
`

const FakeSliderHandle = styled.div<{ perc: number }>`
    position: absolute;
    left: ${({ perc }) => perc}%;
    width: ${ButtonHeight - 4}px;
    height: ${ButtonHeight - 4}px;
    padding: 0px;
    border: none;
    transition: all 100ms;
    pointer-events: none;
    margin-top: -6px;
    margin-left: -12px;
    z-index: 6;
    box-shadow: ${({ theme }) => `3px 3px 6px ${theme.colors.textShadow}`} !important;
    background: ${linearGradient({
        colorStops: getPaletteGradientStops(SummitPalette.EVEREST),
        toDirection: '120deg',
    })};
    border-radius: 20px;
`

interface Props {
    existingLockDuration: number | null
    setLockDuration: (number) => void
}

const EverestLockDurationSlider: React.FC<Props> = ({ existingLockDuration, setLockDuration }) => {
    const existingDurPerc = existingLockDuration != null ? lockDurationSliderPerc(existingLockDuration) : null
    const marks = lockDurationSliderMarks(existingLockDuration)
    const [perc, setPerc] = useState(existingLockDuration != null ? existingDurPerc : null)


    const handleSetLockDuration = (markPerc) => {
        const clampedPerc = Math.max(markPerc, existingDurPerc)
        setPerc(clampedPerc)
        setLockDuration(sliderPercLockDuration(clampedPerc))
    }

    return (
        <SliderWrapper>
            <Slider
                min={0}
                marks={marks}
                step={null}
                onChange={handleSetLockDuration}
                value={perc}
                defaultValue={perc}
            />
            { Object.keys(marks).map((markPerc) =>
                <FakeMarkDot
                    key={markPerc}
                    perc={parseFloat(markPerc)}
                    disabled={parseFloat(markPerc) < existingDurPerc}
                    onClick={() => handleSetLockDuration(markPerc)}
                />
            )}
            { perc != null &&
                <FakeSliderHandle
                    perc={perc}
                />
            }
        </SliderWrapper>
    )
}

export default EverestLockDurationSlider
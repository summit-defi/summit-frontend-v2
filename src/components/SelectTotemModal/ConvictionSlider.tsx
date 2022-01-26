import React, { useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styled, { css } from 'styled-components'
import { darken, linearGradient } from 'polished'
import { pressableMixin } from 'uikit/util/styledMixins'
import { getPaletteGradientStops  } from 'utils'
import { Elevation } from 'config/constants'
import { Flex } from 'uikit/components/Box'
import { Text } from 'uikit/components/Text'

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
        z-index: 6;
    }
    .rc-slider-handle:hover {
        box-shadow: none;
    }
    .rc-slider-handle:active {
        box-shadow: none;
    }

    .rc-slider-mark {
        top: 24px;
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

const FakeMarkDot = styled.div<{ perc: number, isExisting?: boolean }>`
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

    ${({ isExisting }) => isExisting === true && css`
        z-index: 5;

        &:: after {
            border-radius: 6px;
            width: 10px;
            height: 10px;
            background-color: ${linearGradient({
                colorStops: getPaletteGradientStops(Elevation.EXPEDITION),
                toDirection: '120deg',
            })};
        }
    `}
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
    z-index: 7;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${({ theme }) => `3px 3px 6px ${theme.colors.textShadow}`} !important;
    background: ${linearGradient({
        colorStops: getPaletteGradientStops(Elevation.EXPEDITION),
        toDirection: '120deg',
    })};
    border-radius: 20px;
`

const HandleText = styled(Text)`
    position: absolute;
    top: -24px;
`

interface Props {
    existingConviction: number | null
    setConviction: (number) => void
}

const marks = {
    0: '0%',
    50: '50%',
    100: '100%',
}

const ConvictionSlider: React.FC<Props> = ({ existingConviction, setConviction }) => {
    const [perc, setPerc] = useState(existingConviction)

    const handleSetConviction = (markPerc) => {
        setPerc(markPerc)
        setConviction(markPerc)
    }

    return (
        <SliderWrapper>
            <Slider
                min={0}
                marks={marks}
                step={1}
                onChange={handleSetConviction}
                value={perc}
                defaultValue={perc}
            />
            { Object.keys(marks).map((markPerc) =>
                <FakeMarkDot
                    key={markPerc}
                    perc={parseFloat(markPerc)}
                    onClick={() => handleSetConviction(markPerc)}
                />
            )}
            { existingConviction != null &&
                <FakeMarkDot
                    isExisting
                    perc={existingConviction}
                    onClick={() => handleSetConviction(existingConviction)}
                />
            }
            { perc != null &&
                <FakeSliderHandle
                    perc={perc}
                >
                    <HandleText bold monospace>{perc}%</HandleText>
                </FakeSliderHandle>
            }
        </SliderWrapper>
    )
}

export default ConvictionSlider
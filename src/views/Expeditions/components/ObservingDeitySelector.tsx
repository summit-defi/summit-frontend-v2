import React from 'react'
import styled, { css } from 'styled-components'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'
import { BaseDeity } from 'uikit/components/Totem/BaseDeity'
import { elevationUtils, Elevation, SummitPalette } from 'config/constants'

const buttonWidth = 100
const buttonHeight = 38

const SelectorFlex = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 6px;
    margin-right: 6px;
`

const SelectorWrapper = styled(SelectorWrapperBase)`
    display: flex;
    justify-content: center;
    margin: 4px 0px;
    height: ${buttonHeight}px;
    width: ${buttonWidth * 2};
    border-radius: 22px;
    background-color: ${({ theme }) => theme.colors.selectorBackground};
    position: relative;
    ${pressableMixin}
`

const SelectedSummitButton = styled(SummitButton) <{ selectedIndex: number }>`
    pointer-events: none;
    position: absolute;
    height: ${buttonHeight}px;
    width: ${buttonWidth + 5}px;
    left: ${({ selectedIndex }) => selectedIndex * (buttonWidth - 7)}px;
    z-index: 3;
    font-size: 14px;
`


const DeityWrapper = styled.div<{ onButton?: boolean }>`
    ${({ onButton }) => onButton ? css`
        width: ${buttonWidth + 5}px;
        height: ${buttonHeight}px;
    ` : css`
        width: ${buttonWidth - 2}px;
        height: ${buttonHeight - 2}px;
        margin-top: 1px;
        margin-left: 1px;
    `}
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-radius: 50px;
`
const DeityButton = styled.div<{ deity: number, selected: boolean }>`
    pointer-events: none;
    width: ${(buttonHeight * 2) * 1.358}px;
    height: ${buttonHeight * 2}px;
    background-image: ${({ deity, selected }) => `
        url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity)}_OUTLINE.png"),
        ${selected ? `url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity)}_FILL_GLOW.png")` : 'none'}
    `};
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% auto;
    transform: translate(${({ deity }) => deity === 0 ? -20 : 5}%, 20%);
`

interface Props {
    observingDeity: number
    toggleObservingDeity: () => void
}
const ObservingDeitySelector: React.FC<Props> = ({ observingDeity, toggleObservingDeity }) => {
    return (
        <SelectorFlex onClick={toggleObservingDeity}>
            <SelectorWrapper>
                <SelectedSummitButton
                    selectedIndex={observingDeity}
                    padding="0px"
                >
                    <DeityWrapper onButton>
                        <DeityButton deity={observingDeity} selected/>
                    </DeityWrapper>
                </SelectedSummitButton>
                <DeityWrapper>
                    <DeityButton deity={0} selected={false}/>
                </DeityWrapper>
                <DeityWrapper>
                    <DeityButton deity={1} selected={false}/>
                </DeityWrapper>
            </SelectorWrapper>
        </SelectorFlex>
    )
}

export default React.memo(ObservingDeitySelector)

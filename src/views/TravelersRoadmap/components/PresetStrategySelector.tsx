import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'
import { PresetStrategyName, SummitPalette } from 'config/constants'
import { useDispatch } from 'react-redux'
import { useSelectedPresetStrategy, useUserStrategyTitleOwnerDesc } from 'state/hooksNew'
import { selectPresetStrategy } from 'state/summitEcosystem'

const buttonWidth = 240
const buttonHeight = 28

const SelectorFlex = styled(Flex)`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 6px;
    flex: 1;

    ${({ theme }) => theme.mediaQueries.nav} {
        width: ${buttonWidth}px;
    }
`

const SelectorWrapper = styled(SelectorWrapperBase)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 4px 0px;
    height: ${buttonHeight * 4}px;
    width: 100%;
    border-radius: ${buttonHeight / 2}px;
    position: relative;
    background-color: ${({ theme }) => theme.colors.background};
`

const SelectedSummitButton = styled(SummitButton) <{ selectedIndex: number }>`
    pointer-events: none;
    position: absolute;
    left: 2px;
    height: ${buttonHeight - 4}px;
    width: calc(100% - 4px);
    top: ${({ selectedIndex }) => selectedIndex * buttonHeight + 2}px;
    z-index: 3;
    font-size: 14px;
`

const TextButton = styled.div`
    width: 100%;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
    text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
    font-family: Courier Prime, monospace;
    font-size: 14px;
    height: ${buttonHeight}px;
    line-height: ${buttonHeight}px;
    text-align: center;

    ${pressableMixin}
`

const PresetStrategySelector: React.FC = () => {
    const { title } = useUserStrategyTitleOwnerDesc()
    const selectedPresetStrategy = useSelectedPresetStrategy()
    const dispatch = useDispatch()

    const strategies = [
        title || '< USER STRATEGY >',
        PresetStrategyName.YankeeDegen,
        PresetStrategyName.Loyalist,
        PresetStrategyName.Hedger,
    ]

    const selectedStrategyIndex = selectedPresetStrategy === null ? 0 : strategies.indexOf(selectedPresetStrategy)

    const handleSelectStrategy = useCallback((stratIndex) => {
        dispatch(selectPresetStrategy([
            null,
            PresetStrategyName.YankeeDegen,
            PresetStrategyName.Loyalist,
            PresetStrategyName.Hedger,
        ][stratIndex]))
    }, [dispatch])

    return (
        <SelectorFlex>
            <SelectorWrapper>
                <SelectedSummitButton
                    selectedIndex={selectedStrategyIndex}
                    padding="0px"
                >
                    {strategies[selectedStrategyIndex]}
                </SelectedSummitButton>
                {strategies.map((strategy, index) =>
                    <TextButton key={strategy} onClick={() => handleSelectStrategy(index)}>
                        {strategy}
                    </TextButton>
                )}
            </SelectorWrapper>
        </SelectorFlex>
    )
}

export default React.memo(PresetStrategySelector)

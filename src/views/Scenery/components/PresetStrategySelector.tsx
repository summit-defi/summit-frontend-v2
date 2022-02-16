import React from 'react'
import styled from 'styled-components'
import { useFarmType } from 'hooks/useFarmType'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { FarmType } from 'state/types'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'
import { SummitPalette } from 'config/constants'

const buttonWidth = 240
const buttonHeight = 28

const SelectorFlex = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  margin-right: 6px;
`

const SelectorWrapper = styled(SelectorWrapperBase)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 4px 0px;
  height: ${buttonHeight * 4}px;
  width: ${buttonWidth};
  border-radius: ${buttonHeight / 2}px;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
`

const SelectedSummitButton = styled(SummitButton) <{ selectedIndex: number }>`
  pointer-events: none;
  position: absolute;
  left: 2px;
  height: ${buttonHeight - 4}px;
  width: ${buttonWidth - 4}px;
  top: ${({ selectedIndex }) => selectedIndex * buttonHeight + 2}px;
  z-index: 3;
  font-size: 14px;
`

const TextButton = styled.div`
  width: ${buttonWidth}px;
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


interface Props {
    strategies: string[]
    selectedStrategy: number
    selectStrategy: (number) => void
}

const PresetStrategySelector: React.FC<Props> = ({ strategies, selectedStrategy, selectStrategy }) => {
    return (
        <SelectorFlex>
            <SelectorWrapper>
                <SelectedSummitButton
                    selectedIndex={selectedStrategy}
                    summitPalette={SummitPalette.PLAINS}
                    padding="0px"
                >
                    {strategies[selectedStrategy]}
                </SelectedSummitButton>
                {strategies.map((strategy, index) =>
                    <TextButton key={strategy} onClick={() => selectStrategy(index)}>
                        {strategy}
                    </TextButton>
                )}
            </SelectorWrapper>
        </SelectorFlex>
    )
}

export default React.memo(PresetStrategySelector)

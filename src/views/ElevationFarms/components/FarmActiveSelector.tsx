import React from 'react'
import styled from 'styled-components'
import { useSelectedElevation } from 'state/hooks'
import { useFarmType } from 'hooks/useFarmType'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { FarmType } from 'state/types'
import { darken } from 'polished'
import { pressableMixin } from 'uikit/util/styledMixins'

const buttonWidth = 120
const buttonHeight = 28

const SelectorFlex = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 16px;
`

const SelectorWrapper = styled(Flex)`
  justify-content: center;
  margin: 4px 0px;
  height: ${buttonHeight}px;
  width: ${buttonWidth * 2};
  border-radius: 22px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
  position: relative;
`

const SelectedSummitButton = styled(SummitButton)<{ selectedIndex: number }>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  height: ${buttonHeight - 4}px;
  width: ${buttonWidth - 4}px;
  left: ${({ selectedIndex }) => selectedIndex * buttonWidth + 2}px;
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

  transition: transform 0.2s;

  ${pressableMixin}
`

const FarmActiveSelector: React.FC = () => {
  const elevation = useSelectedElevation()
  const { liveFarms, onSetLive } = useFarmType()
  return (
    <SelectorFlex>
      <SelectorWrapper>
        <SelectedSummitButton
          elevation={elevation}
          selectedIndex={liveFarms ? 0 : 1}
          padding="0px"
        >
          {liveFarms ? 'Active' : 'Inactive'}
        </SelectedSummitButton>
        <TextButton onClick={() => onSetLive(true)}>
          Active
        </TextButton>
        <TextButton onClick={() => onSetLive(false)}>
          Inactive
        </TextButton>
      </SelectorWrapper>
    </SelectorFlex>
  )
}

export default React.memo(FarmActiveSelector)
import React from 'react'
import styled from 'styled-components'
import { useSelectedElevation } from 'state/hooks'
import { useFarmType } from 'hooks/useFarmType'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { FarmType } from 'state/types'
import { darken } from 'polished'
import { pressableMixin } from 'uikit/util/styledMixins'

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
  height: 32px;
  width: 225px;
  border-radius: 22px;
  background-color: ${({ theme }) => darken(0.1, theme.colors.background)};
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
  position: relative;
`

const getFarmTypeWidth = (farmType: FarmType): number => {
  switch (farmType) {
    case FarmType.Token:
      return 85
    case FarmType.LP:
      return 70
    default:
    case FarmType.All:
      return 70
  }
}

const getFarmTypeOffset = (farmType: FarmType): number => {
  switch (farmType) {
    case FarmType.Token:
      return 72
    case FarmType.LP:
      return 153
    default:
    case FarmType.All:
      return 2
  }
}

const SelectedSummitButton = styled(SummitButton)<{ selectedFarmType: FarmType }>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  height: 28px;
  width: ${({ selectedFarmType }) => getFarmTypeWidth(selectedFarmType)}px;
  left: ${({ selectedFarmType }) => getFarmTypeOffset(selectedFarmType)}px;
  z-index: 3;
`

const TextButton = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
  font-family: Courier Prime, monospace;
  font-size: 16px;
  height: 32px;
  line-height: 32px;
  text-align: center;

  transition: transform 0.2s;

  ${pressableMixin}
`

const ToggleWrapper = styled(Flex)`
  margin-left: 8px;
  justify-content: center;
  height: 32px;
  width: 110px;
  border-radius: 22px;
  background-color: ${({ theme }) => darken(0.1, theme.colors.background)};
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};

  position: relative;
`

const ToggleSummitButton = styled(SummitButton)<{ live: boolean }>`
  display: ${({ live }) => (live ? 'flex' : 'none')};
  position: absolute;
  top: 2px;
  height: 28px;
  width: 106px;
  left: 2px;
  z-index: 3;
`

interface SelectableOption {
  
}

interface Props {
  options: SelectableOption[]
  selected: string
}

const HorizontalSelector: React.FC = () => {
  const elevation = useSelectedElevation()
  const { farmType, liveFarms, onSetFarmType, onSetLive } = useFarmType()
  return (
    <SelectorFlex>
      <SelectorWrapper>
        <SelectedSummitButton
          elevation={elevation}
          selectedFarmType={farmType}
          padding="0px"
          onClick={() => onSetFarmType(FarmType.All)}
        >
          {farmType}
        </SelectedSummitButton>
        <TextButton width={getFarmTypeWidth(FarmType.All)} onClick={() => onSetFarmType(FarmType.All)}>
          {FarmType.All}
        </TextButton>
        <TextButton width={getFarmTypeWidth(FarmType.Token)} onClick={() => onSetFarmType(FarmType.Token)}>
          {FarmType.Token}
        </TextButton>
        <TextButton width={getFarmTypeWidth(FarmType.LP)} onClick={() => onSetFarmType(FarmType.LP)}>
          {FarmType.LP}
        </TextButton>
      </SelectorWrapper>

      <ToggleWrapper>
        <ToggleSummitButton elevation={elevation} live={liveFarms} padding="0px" onClick={() => onSetLive(false)}>
          Active
        </ToggleSummitButton>
        <TextButton width={120} onClick={() => onSetLive(true)}>
          Inactive
        </TextButton>
      </ToggleWrapper>
    </SelectorFlex>
  )
}

export default React.memo(HorizontalSelector)

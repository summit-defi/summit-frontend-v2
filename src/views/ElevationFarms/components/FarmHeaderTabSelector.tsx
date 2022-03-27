import React, { useCallback } from 'react'
import { darken } from 'polished'
import styled, { css } from 'styled-components'
import { HeaderArtwork, HeaderElevationName } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'
import { Elevation } from 'config/constants'

const HeaderSelector = styled(SelectorWrapperBase)`
  z-index: 3;
  height: 192px;
  width: 318px;
  position: absolute;
  left: 0px;
  right: 0px;
  top: -96px;
  display: flex;
  align-items: center;
  border-radius: 192px;
  justify-content: center;
  margin: auto;
`

const BaseTextButton = styled.div`
  width: 120px;
  height: 192px;
  vertical-align: middle;
  top: 0px;
  padding-top: 83px;
  padding-bottom: 83px;
  margin: auto;
  position: absolute;
  color: ${({ theme }) => darken(0.2, theme.colors.text)};
  text-shadow: 1px 1px 2px ${({ theme }) => darken(0.2, theme.colors.text)};
  font-family: Courier Prime, monospace;
  font-size: 16px;
  text-align: center;

  ${pressableMixin}
`

const LeftTextButton = styled(BaseTextButton)`
  left: 0px;
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
`
const RightTextButton = styled(BaseTextButton)`
  right: 0px;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
`

const HeaderArtworkSlider = styled.div<{ selectedCard: FarmingTab }>`
  position: absolute;
  left: ${({ selectedCard }) => (selectedCard === FarmingTab.Farm ? 0 : 124)}px;
  top: 0px;
`

const ElevationHeaderArtworkButton = styled(HeaderArtwork)<{ selected: boolean }>`
  width: 184px;
  height: 184px;
  left: 4px;
  top: 4px;
  position: absolute;
  opacity: ${({ selected }) => (selected ? 1 : 0)};
`

const ArtworkTotemHeaderButton = styled.div<{ selected: boolean }>`
  position: absolute;
  left: -2px;
  top: -2px;
  opacity: ${({ selected }) => (selected ? 1 : 0)};
`

interface Props {
  selected: FarmingTab
  onSelect: (card: FarmingTab) => void
}

export enum FarmingTab {
  Farm = 'Farm',
  YieldWars = 'YieldWars',
}

export const FarmHeaderTabSelector: React.FC<Props> = ({ selected, onSelect }) => {
  const selectElevationCard = useCallback(() => {
    onSelect(FarmingTab.Farm)
  }, [onSelect])

  const selectYieldWarsCard = useCallback(() => {
    onSelect(FarmingTab.YieldWars)
  }, [onSelect])

  return (
    <HeaderSelector>
      <LeftTextButton onClick={selectElevationCard}>
        FARMING
        <br />
        INFO
      </LeftTextButton>
      <RightTextButton onClick={selectYieldWarsCard}>
        BATTLE
        <br />
        ARENA
      </RightTextButton>

      <HeaderArtworkSlider selectedCard={selected}>
        <ElevationHeaderArtworkButton
          elevation={Elevation.OASIS}
          selected={selected === FarmingTab.Farm}
        >
          <HeaderElevationName header elevationName={Elevation.OASIS}>
            FARMING
            <br/>
            INFO
          </HeaderElevationName>
        </ElevationHeaderArtworkButton>

        <ElevationHeaderArtworkButton
          elevation={Elevation.PLAINS}
          selected={selected === FarmingTab.YieldWars}
        >
          <HeaderElevationName header elevationName={Elevation.PLAINS}>
            BATTLE
            <br/>
            ARENA
          </HeaderElevationName>
        </ElevationHeaderArtworkButton>
      </HeaderArtworkSlider>
    </HeaderSelector>
  )
}

import React, { useCallback, useState } from 'react'
import { Elevation } from 'config/constants/types'
import { darken } from 'polished'
import { useSelectedElevationWinningTotem } from 'state/hooks'
import styled, { css } from 'styled-components'
import ArtworkTotem from '../../../../uikit/components/Totem/ArtworkTotem'
import { HeaderArtwork, HeaderElevationName } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'

const HeaderSelector = styled.div`
  z-index: 3;
  height: 200px;
  width: 326px;
  position: absolute;
  left: 0px;
  right: 0px;
  top: -100px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => darken(0.1, theme.colors.background)};
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
  border-radius: 200px;
  justify-content: center;
  margin: auto;
`

const BaseTextButton = styled.div<{ disabled: boolean }>`
  width: 120px;
  height: 200px;
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

  transition: transform 0.2s;

  ${({ theme, disabled }) =>
    pressableMixin({
      theme,
      disabled,
      disabledStyles: css`
        text-decoration: line-through;
      `,
    })}
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

const HeaderArtworkSlider = styled.div<{ selectedCard: MobileSelectedCard }>`
  position: absolute;
  transition: all 300ms;
  left: ${({ selectedCard }) => (selectedCard === MobileSelectedCard.ElevationCard ? 0 : 124)}px;
  top: 0px;
`

const ElevationHeaderArtworkButton = styled(HeaderArtwork)<{ selected: boolean }>`
  width: 192px;
  height: 192px;
  left: 4px;
  top: 4px;
  position: absolute;
  transition: opacity 300ms;
  opacity: ${({ selected }) => (selected ? 1 : 0)};
`

const ArtworkTotemHeaderButton = styled.div<{ selected: boolean }>`
  position: absolute;
  left: -2px;
  top: -2px;
  transition: opacity 300ms;
  opacity: ${({ selected }) => (selected ? 1 : 0)};
`

interface Props {
  userTotem: number
  elevation: Elevation
  selectMobileHeaderCard: (card: MobileSelectedCard) => void
}

export enum MobileSelectedCard {
  ElevationCard = 'ElevationCard',
  TotemCard = 'Totem',
}

export const MobileHeaderCardSelector: React.FC<Props> = ({ userTotem, elevation, selectMobileHeaderCard }) => {
  const [selectedCard, setSelectedCard] = useState(MobileSelectedCard.ElevationCard)
  const crownedTotem = useSelectedElevationWinningTotem()

  const selectElevationCard = useCallback(() => {
    selectMobileHeaderCard(MobileSelectedCard.ElevationCard)
    setSelectedCard(MobileSelectedCard.ElevationCard)
  }, [selectMobileHeaderCard, setSelectedCard])

  const selectTotemCard = useCallback(() => {
    if (userTotem == null) return
    selectMobileHeaderCard(MobileSelectedCard.TotemCard)
    setSelectedCard(MobileSelectedCard.TotemCard)
  }, [userTotem, selectMobileHeaderCard, setSelectedCard])

  return (
    <HeaderSelector>
      <LeftTextButton disabled={false} onClick={selectElevationCard}>
        ELEVATION
        <br />
        INFO
      </LeftTextButton>
      <RightTextButton disabled={userTotem == null} onClick={selectTotemCard}>
        TOTEM
        <br />
        INFO
      </RightTextButton>

      <HeaderArtworkSlider selectedCard={selectedCard}>
        <ElevationHeaderArtworkButton
          elevation={elevation}
          selected={selectedCard === MobileSelectedCard.ElevationCard}
        >
          <HeaderElevationName header elevationName={elevation}>
            THE {elevation}
          </HeaderElevationName>
        </ElevationHeaderArtworkButton>

        <ArtworkTotemHeaderButton selected={selectedCard === MobileSelectedCard.TotemCard}>
          <ArtworkTotem
            elevation={elevation}
            totem={userTotem}
            crowned={userTotem === crownedTotem}
            desktopSize="192"
            mobileSize="192"
          />
        </ArtworkTotemHeaderButton>
      </HeaderArtworkSlider>
    </HeaderSelector>
  )
}

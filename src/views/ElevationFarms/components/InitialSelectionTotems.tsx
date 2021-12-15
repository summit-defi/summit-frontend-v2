import React from 'react'
import styled from 'styled-components'
import { Elevation, elevationUtils } from 'config/constants/types'
import { Flex } from 'uikit'
import SelectedTotem from './SelectedTotem'

const TotemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const PaddedFlex = styled(Flex)`
  & > * {
    padding: 6px;
  }
`

const PaddedFlexDesktopOnly = styled(PaddedFlex)`
  ${({ theme }) => theme.mediaQueries.invNav} {
    display: none;
  }
`
const PaddedFlexMobileOnly = styled(PaddedFlex)`
  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const renderTotems = (
  elevation: Elevation,
  totems: number[],
  userTotem: number | null,
  onSelect: (totem: number) => void,
) => {
  switch (elevation) {
    case Elevation.SUMMIT:
      return (
        <>
          <PaddedFlex flexDirection="row" justifyContent="center" flexWrap="wrap">
            {totems.slice(0, 3).map((totem) => (
              <SelectedTotem
                key={totem}
                elevation={elevation}
                totem={totem}
                navSize="98"
                size="128"
                disabled={totem === userTotem}
                onSelect={onSelect}
              />
            ))}
          </PaddedFlex>

          <PaddedFlexMobileOnly flexDirection="row" justifyContent="center">
            {totems.slice(3, 5).map((totem) => (
              <SelectedTotem
                key={totem}
                elevation={elevation}
                totem={totem}
                navSize="98"
                size="128"
                disabled={totem === userTotem}
                onSelect={onSelect}
              />
            ))}
          </PaddedFlexMobileOnly>
          <PaddedFlexMobileOnly flexDirection="row" justifyContent="center">
            {totems.slice(5, 8).map((totem) => (
              <SelectedTotem
                key={totem}
                elevation={elevation}
                totem={totem}
                navSize="98"
                size="128"
                disabled={totem === userTotem}
                onSelect={onSelect}
              />
            ))}
          </PaddedFlexMobileOnly>
          <PaddedFlexMobileOnly flexDirection="row" justifyContent="center">
            {totems.slice(8, 10).map((totem) => (
              <SelectedTotem
                key={totem}
                elevation={elevation}
                totem={totem}
                navSize="98"
                size="128"
                disabled={totem === userTotem}
                onSelect={onSelect}
              />
            ))}
          </PaddedFlexMobileOnly>

          <PaddedFlexDesktopOnly flexDirection="row" justifyContent="center">
            {totems.slice(3, 7).map((totem) => (
              <SelectedTotem
                key={totem}
                elevation={elevation}
                totem={totem}
                navSize="98"
                size="128"
                disabled={totem === userTotem}
                onSelect={onSelect}
              />
            ))}
          </PaddedFlexDesktopOnly>
          <PaddedFlexDesktopOnly flexDirection="row" justifyContent="center">
            {totems.slice(7, 10).map((totem) => (
              <SelectedTotem
                key={totem}
                elevation={elevation}
                totem={totem}
                navSize="98"
                size="128"
                disabled={totem === userTotem}
                onSelect={onSelect}
              />
            ))}
          </PaddedFlexDesktopOnly>
        </>
      )
    case Elevation.MESA:
      return (
        <>
          <PaddedFlex flexDirection="row" justifyContent="center">
            {totems.slice(0, 3).map((totem) => (
              <SelectedTotem
                key={totem}
                elevation={elevation}
                totem={totem}
                navSize="98"
                size="128"
                disabled={totem === userTotem}
                onSelect={onSelect}
              />
            ))}
          </PaddedFlex>
          <PaddedFlex flexDirection="row" justifyContent="center">
            {totems.slice(3, 5).map((totem) => (
              <SelectedTotem
                key={totem}
                elevation={elevation}
                totem={totem}
                navSize="98"
                size="128"
                disabled={totem === userTotem}
                onSelect={onSelect}
              />
            ))}
          </PaddedFlex>
        </>
      )
    case Elevation.PLAINS:
      return (
        <PaddedFlex flexDirection="row" justifyContent="center">
          {totems.map((totem) => (
            <SelectedTotem
              key={totem}
              elevation={elevation}
              totem={totem}
              navSize="128"
              disabled={totem === userTotem}
              onSelect={onSelect}
            />
          ))}
        </PaddedFlex>
      )
    default:
    case Elevation.OASIS:
      return <SelectedTotem elevation={elevation} totem={0} navSize="156" disabled onSelect={onSelect} />
  }
}

interface Props {
  elevation: Elevation
  userTotem: number | null
  onSelect: (totem: number) => void
}

const InitialSelectionTotems: React.FC<Props> = ({ elevation, userTotem, onSelect }) => {
  if (elevation == null) return null
  const allTotems = elevationUtils.totemsArray(elevation)
  return (
    <>
      <TotemsWrapper>{renderTotems(elevation, allTotems, userTotem, onSelect)}</TotemsWrapper>
    </>
  )
}

export default InitialSelectionTotems

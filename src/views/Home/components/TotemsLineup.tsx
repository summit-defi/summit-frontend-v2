import React from 'react'
import { Flex, HighlightedText } from 'uikit'
import styled from 'styled-components'
import { useElevationTotems, useWinningTotems } from '../../../state/hooks'
import { InverseDeity } from 'views/ElevationFarms/components/InverseDeity'
import ArtworkTotem from 'views/ElevationFarms/components/ArtworkTotem'
import { Elevation, elevationUtils } from 'config/constants/types'

const TotemsLineupFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
  }
`
const TotemsLineupRow = styled(Flex)`
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.invNav} {
    width: 100%;
    justify-content: space-around;
  }
`

const DietyWrapper = styled.div`
  position: relative;
  display: flex;

  filter: drop-shadow(-0.5vw 0.5vw 0.5vw white) drop-shadow(-4vw 2vw 4vw #ae6481) drop-shadow(4vw -2vw 4vw #0d172e);
`

const InverseDeityText = styled(HighlightedText)`
  left: 0;
  right: 0;
  bottom: 36px;
  text-align: center;
  position: absolute;
  color: #ebf2fd;
  text-shadow: none; ;
`

const TotemsLineup = () => {
  const totems = useElevationTotems()
  const crownedTotems = useWinningTotems()
  
  return (
    <TotemsLineupFlex>
      <TotemsLineupRow>
        <ArtworkTotem withName crowned elevation={Elevation.OASIS} totem={0} desktopSize="154" mobileSize="76" />
        <ArtworkTotem
          withName
          elevation={Elevation.PLAINS}
          crowned={
            crownedTotems[elevationUtils.toInt(Elevation.PLAINS)] === totems[elevationUtils.toInt(Elevation.PLAINS)]
          }
          totem={totems[elevationUtils.toInt(Elevation.PLAINS)]}
          desktopSize="154"
          mobileSize="76"
        />
        <ArtworkTotem
          withName
          elevation={Elevation.MESA}
          crowned={crownedTotems[elevationUtils.toInt(Elevation.MESA)] === totems[elevationUtils.toInt(Elevation.MESA)]}
          totem={totems[elevationUtils.toInt(Elevation.MESA)]}
          desktopSize="154"
          mobileSize="76"
        />
        <ArtworkTotem
          withName
          elevation={Elevation.SUMMIT}
          crowned={
            crownedTotems[elevationUtils.toInt(Elevation.SUMMIT)] === totems[elevationUtils.toInt(Elevation.SUMMIT)]
          }
          totem={totems[elevationUtils.toInt(Elevation.SUMMIT)]}
          desktopSize="154"
          mobileSize="76"
        />
      </TotemsLineupRow>
      {totems[elevationUtils.toInt(Elevation.EXPEDITION)] != null && (
        <DietyWrapper>
          <InverseDeity deity={totems[elevationUtils.toInt(Elevation.EXPEDITION)]} selected />
          <InverseDeityText fontSize="20px">
            {elevationUtils.getElevationTotemName(
              Elevation.EXPEDITION,
              totems[elevationUtils.toInt(Elevation.EXPEDITION)],
              false
            )}
          </InverseDeityText>
        </DietyWrapper>
      )}
    </TotemsLineupFlex>
  )
}

export default TotemsLineup

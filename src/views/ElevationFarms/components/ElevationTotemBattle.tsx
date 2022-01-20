import React from 'react'
import { Elevation, ElevationFarmTab, elevationTabToElevation, elevationUtils } from 'config/constants/types'
import { Flex, Text } from 'uikit'
import { useElevationUserRoundInfo, useElevationTotem, useElevationFarmsTab, useDashboardTotemBattleInfo } from 'state/hooks'
import TotemBattleBreakdown from './TotemBattleBreakdown'
import styled from 'styled-components'

const GappedFlex = styled(Flex)`
  gap: 18px;
  justify-content: center;
  align-items: center;
`

const MultiElevBattleText = styled(Text)`
  text-align: center;
  width: 100%;
  
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 150px;
  }
`

const MobileVerticalFlex = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
  }
`

const DesktopOnlyBreak = styled.br`
  display: none;
  ${({ theme }) => theme.mediaQueries.nav} {
    display: inherit;
  }
`

const AllElevationsTotemBattles: React.FC = () => {
  const totemBattleInfo = useDashboardTotemBattleInfo()

  return (
    <MobileVerticalFlex>
      <MultiElevBattleText bold monospace>
        {'YOUR TOTEMS '}
        <DesktopOnlyBreak/>
        {'IN BATTLE '}
      </MultiElevBattleText>
      <GappedFlex>
        { elevationUtils.elevationOnly.map((elev, index) => (
          <TotemBattleBreakdown
            key={elev}
            elevation={elev}
            totemInfos={totemBattleInfo[index]}
            userTotem={-1}
            fullWidth={false}
            multiElev
          />
        ))}
      </GappedFlex>
    </MobileVerticalFlex>
  )
}

const SingleElevationTotemBattle: React.FC<{ elevationTab: ElevationFarmTab }> = ({ elevationTab }) => {
  const elevation = elevationTabToElevation[elevationTab]
  const { totemMultipliers } = useElevationUserRoundInfo(elevation)
  const userTotem = useElevationTotem(elevation)

  const totemInfos = elevationUtils.totemsArray(elevation).map((totem) => ({
    totem,
    mult: totemMultipliers[totem],
  }))

  if (elevation === Elevation.OASIS) return null

  return (
    <TotemBattleBreakdown
      // title={`${elevation} TOTEM BATTLE`}
      elevation={elevation}
      totemInfos={totemInfos}
      userTotem={userTotem}
    />
  )
}

const ElevationTotemBattle: React.FC = () => {
  const elevationTab = useElevationFarmsTab()

  if (elevationTab === ElevationFarmTab.DASH) return (
    <AllElevationsTotemBattles/>
  ) 

  return (
    <SingleElevationTotemBattle elevationTab={elevationTab}/>
  )
  
}

export default React.memo(ElevationTotemBattle)

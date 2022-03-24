import React, { useState } from 'react'
import { Elevation, ElevationFarmTab, elevationTabToElevation, elevationUtils } from 'config/constants/types'
import { Flex, Text } from 'uikit'
import { useElevationFarmsTab } from 'state/hooks'
import TotemBattleBreakdown from './TotemBattleBreakdown'
import styled from 'styled-components'
import { useDashboardTotemBattleInfo, useElevationTotemBattleInfo } from 'state/hooksNew'
import { useSelectTotemModal } from 'components/SelectTotemModal'
import useTotemWinnersModal from 'uikit/widgets/TotemWinnersModal/useTotemWinnersModal'

const GappedFlex = styled(Flex)`
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

const SingleElevationTotemBattle: React.FC<{ elevation: Elevation }> = React.memo(({ elevation }) => {
  const { userTotem, userTotemCrowned, totemInfos } = useElevationTotemBattleInfo(elevation)
  const { onPresentTotemWinnersModal } = useTotemWinnersModal()
  const { onPresentSelectTotemModal } = useSelectTotemModal()

  return (
    <TotemBattleBreakdown
      elevation={elevation}
      totemInfos={totemInfos}
      userTotem={userTotem}
      userTotemCrowned={userTotemCrowned}
      onPresentTotemWinnersModal={onPresentTotemWinnersModal}
      onPresentSelectTotemModal={onPresentSelectTotemModal}
    />
  )
})

const MultiElevTotemBattles: React.FC = () => {
  const totemBattleInfo = useDashboardTotemBattleInfo()
  // const [elevToBreakdown, setElevToBreakdown] = useState<Elevation | undefined>(undefined)

  return (
    <Flex flexDirection='column' width='100%'>
      {/* <MultiElevBattleText bold monospace>
        {'YOUR TOTEMS '}
        <DesktopOnlyBreak/>
        {'IN BATTLE '}
      </MultiElevBattleText> */}
      {/* <GappedFlex>
        { elevationUtils.elevationOnly.map((elev, index) => (
          <TotemBattleBreakdown
            key={elev}
            elevation={elev}
            totemInfos={totemBattleInfo[index]}
            userTotem={-1}
            fullWidth={false}
            multiElev
            selectable
            selectedElevation={elevToBreakdown}
            onSelect={setElevToBreakdown}
          />
        ))}
      </GappedFlex> */}


      {/* {elevToBreakdown != null && */}
      <SingleElevationTotemBattle elevation={Elevation.PLAINS}/>
      <SingleElevationTotemBattle elevation={Elevation.MESA}/>
      <SingleElevationTotemBattle elevation={Elevation.SUMMIT}/>
      {/* } */}
    </Flex>
  )

  // if (elevation === Elevation.OASIS) return null

  // return (
  //   <SingleElevationTotemBattle elevation={elevation}/>
  // )
}

export default React.memo(MultiElevTotemBattles)

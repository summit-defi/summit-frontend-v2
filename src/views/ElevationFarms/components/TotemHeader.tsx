import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { ElevationFarmTab, elevationTabToElevation } from 'config/constants/types'
import { Flex } from 'uikit'
import {
  useElevationFarmsTab,
} from 'state/hooks'
import ElevationIntroduction from './ElevationIntroduction'
import UnlockButton from 'components/UnlockButton'
import ElevationWinnings from './ElevationWinnings'
import MultiElevTotemBattles from './ElevationTotemBattle'
import ElevationYieldBet from './ElevationYieldBet'
import MultiElevStaked from './MultiElevStaked'
import TotemHeaderButtonsRow from './TotemHeaderButtonsRow'
import { useWeb3React } from '@web3-react/core'
import MultiElevYieldBet from './MultiElevYieldBet'
import MultiElevWinningsAndClaim from './MultiElevWinningsAndClaim'
import { LifetimeSummitWinnings } from './LifetimeSummitWinnings'
import { useElevationUserTotem } from 'state/hooksNew'
import { FarmHeaderTabSelector, FarmingTab } from './FarmHeaderTabSelector'

const HeaderCardsWrapper = styled(Flex)`
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 32px;
  margin: 0px auto 32px auto;
  max-width: 850px;
`

const HeaderWrapper = styled(Flex)`
  position: relative;
  z-index: 10;
  padding: 16px;
  padding-top: 112px;
  padding-bottom: 24px;
  margin-top: 64px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  width: 100%;
  height: 100%;
  gap: 36px;
`

const HeaderButtonsRow = styled(Flex)`
  position: absolute;
  top: 0px;
  width: 318px;
  gap: 12px;
`


const StyledUnlockButton = styled(UnlockButton)`
  margin: 32px auto 0px auto;
`

const ElevSpecificSection = memo(() => {
  const elevationTab = useElevationFarmsTab()


  return (
    <>
      {/* { elevationTab !== ElevationFarmTab.OASIS && <ElevationYieldBet/> } */}
      {/* <ElevationWinnings/> */}
    </>
  )
})

const MultiElevSection = memo(() => (
  <>
    <MultiElevStaked/>
    <MultiElevWinningsAndClaim/>
  </>
))

const TotemHeaderUserFarmingSection = memo(() => {
  const elevationTab = useElevationFarmsTab()
  const userTotem = useElevationUserTotem(elevationTabToElevation[elevationTab])

  return (
    <>
      { elevationTab !== ElevationFarmTab.DASH && userTotem != null && <ElevSpecificSection/> }
      { elevationTab === ElevationFarmTab.DASH && <MultiElevSection/> }
    </>
  )
})

const TotemHeaderYieldWarsSection = memo(() => {
  const elevationTab = useElevationFarmsTab()
  const userTotem = useElevationUserTotem(elevationTabToElevation[elevationTab])

  return (
    <>
      <MultiElevTotemBattles/>
      <MultiElevYieldBet/>
    </>
  )
})

const TotemHeader: React.FC = () => {
  const elevationTab = useElevationFarmsTab()
  const { account } = useWeb3React()
  const [selectedTab, selectTab] = useState<FarmingTab>(FarmingTab.Farm)

  return (
    <HeaderCardsWrapper>
      <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <HeaderButtonsRow flexDirection="row" justifyContent="center" alignItems="center">
          <FarmHeaderTabSelector
            selected={selectedTab}
            onSelect={selectTab}
          />
        </HeaderButtonsRow>
        <ElevationIntroduction/>
        { account == null ?
          <StyledUnlockButton summitPalette={elevationTab} /> :
          (selectedTab === FarmingTab.Farm ?
            <MultiElevSection/> :
            <TotemHeaderYieldWarsSection/>
          )
        }
      </HeaderWrapper>
    </HeaderCardsWrapper>
  )
}

export default React.memo(TotemHeader)

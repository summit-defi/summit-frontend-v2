import React, { memo } from 'react'
import styled from 'styled-components'
import { ElevationFarmTab, elevationTabToElevation } from 'config/constants/types'
import { Flex } from 'uikit'
import {
  useElevationFarmsTab,
} from 'state/hooks'
import ElevationIntroduction from './ElevationIntroduction'
import UnlockButton from 'components/UnlockButton'
import ElevationWinnings from './ElevationWinnings'
import ElevationTotemBattle from './ElevationTotemBattle'
import ElevationYieldBet from './ElevationYieldBet'
import MultiElevStaked from './MultiElevStaked'
import TotemHeaderButtonsRow from './TotemHeaderButtonsRow'
import { useWeb3React } from '@web3-react/core'
import MultiElevYieldBet from './MultiElevYieldBet'
import MultiElevWinningsAndClaim from './MultiElevWinningsAndClaim'
import { LifetimeSummitWinnings } from './LifetimeSummitWinnings'
import { useElevationUserTotem } from 'state/hooksNew'

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
  margin-top: 124px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  width: 100%;
  height: 100%;
  gap: 24px;
`


const StyledUnlockButton = styled(UnlockButton)`
  margin: 32px auto 0px auto;
`



const getListeners = component => {
  return Object.fromEntries(
    Object
        .entries(component.props) // Get the props
        .filter(([key, value]) => key.startsWith("on")) // Filter event listeners
  );
};

const ElevSpecificSection = memo(() => {
  const elevationTab = useElevationFarmsTab()


  return (
    <>
      { elevationTab !== ElevationFarmTab.OASIS && <ElevationYieldBet/> }
      <ElevationWinnings/>
    </>
  )
})

const MultiElevSection = memo(() => (
  <>
    <MultiElevYieldBet/>
    <MultiElevStaked/>
    <MultiElevWinningsAndClaim/>
  </>
))

const TotemHeaderAccountSection = memo(() => {
  const elevationTab = useElevationFarmsTab()
  const userTotem = useElevationUserTotem(elevationTabToElevation[elevationTab])

  return (
    <>
      <ElevationTotemBattle/>
      { elevationTab !== ElevationFarmTab.DASH && userTotem != null && <ElevSpecificSection/> }
      { elevationTab === ElevationFarmTab.DASH && <MultiElevSection/> }
    </>
  )
})

const TotemHeader: React.FC = () => {
  const elevationTab = useElevationFarmsTab()
  const { account } = useWeb3React()

  return (
    <HeaderCardsWrapper>
      <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <TotemHeaderButtonsRow/>
        <LifetimeSummitWinnings/>
        <ElevationIntroduction/>
        { account == null ?
          <StyledUnlockButton summitPalette={elevationTab} /> :
          <TotemHeaderAccountSection/>
        }
      </HeaderWrapper>
    </HeaderCardsWrapper>
  )
}

export default React.memo(TotemHeader)

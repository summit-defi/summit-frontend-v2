import React, { memo } from 'react'
import styled from 'styled-components'
import { ElevationFarmTab, elevationTabToElevation } from 'config/constants/types'
import { Flex } from 'uikit'
import {
  useElevationFarmsTab,
  useElevationTotem,
} from 'state/hooks'
import ElevationIntroduction from './ElevationIntroduction'
import UnlockButton from 'components/UnlockButton'
import ElevationWinnings from './ElevationWinnings'
import ElevationTotemBattle from './ElevationTotemBattle'
import ElevationYieldBet from './ElevationYieldBet'
import MultiElevStaked from './MultiElevStaked'
import TotemHeaderButtonsRow from './TotemHeaderButtonsRow'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import MultiElevYieldBet from './MultiElevYieldBet'
import MultiElevWinningsAndClaim from './MultiElevWinningsAndClaim'

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
  const userTotem = useElevationTotem(elevationTabToElevation[elevationTab])

  return (
    <>
      <ElevationTotemBattle/>
      { userTotem != null && <ElevSpecificSection/> }
      { elevationTab === ElevationFarmTab.DASH && <MultiElevSection/> }
    </>
  )
})

const TotemHeader: React.FC = () => {
  const elevationTab = useElevationFarmsTab()
  const { account }: { account: string } = useWallet()

  return (
    <HeaderCardsWrapper>
      <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <TotemHeaderButtonsRow/>
        <ElevationIntroduction/>
        { account == null ?
          <UnlockButton summitPalette={elevationTab} /> :
          <TotemHeaderAccountSection/>
        }
      </HeaderWrapper>
    </HeaderCardsWrapper>
  )
}

export default React.memo(TotemHeader)

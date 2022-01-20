import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Elevation, ElevationFarmTab, elevationTabToElevation, elevationUtils } from 'config/constants/types'
import { ElevationPuck, Flex, Text } from 'uikit'
import {
  useElevationFarmsTab,
  useElevationLocked,
  useElevationTotem,
  useIsElevationLockedUntilRollover,
  useMediaQuery,
  useSelectedElevation,
  useSelectedElevationWinningTotem,
} from 'state/hooks'
import ElevationInfo from './ElevationInfo'
import ElevationTimerAndRollover from './ElevationTimerAndRollover'
import ElevationIntroduction from './ElevationIntroduction'
import ArtworkTotem from './ArtworkTotem'
import SummitIconButton from 'uikit/components/Button/SummitIconButton'
import useTotemWinnersModal from 'uikit/widgets/TotemWinnersModal/useTotemWinnersModal'
import useSelectTotemModal from 'uikit/widgets/SelectTotemModal/useSelectTotemModal'
import SummitButton from 'uikit/components/Button/SummitButton'
import FarmTypeSelector from './FarmTypeSelector'
import ElevationUserRoundInfo from './ElevationUserRoundInfo'
import { MobileHeaderCardSelector, MobileSelectedCard } from './HeaderCards/MobileHeaderCardSelector'
import UnlockButton from 'components/UnlockButton'
import BoundedProgressBar from './BoundedProgressBar'
import ContributionBreakdown from './ContributionBreakdown'
import TotemBattleBreakdown from './TotemBattleBreakdown'
import ElevationContributionBreakdown from './ElevationContributionBreakdown'
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

const TotemHeader: React.FC = () => {
  const elevationTab = useElevationFarmsTab()
  const userTotem = useElevationTotem(elevationTabToElevation[elevationTab])
  const { account }: { account: string } = useWallet()

  return (
    <HeaderCardsWrapper>
      <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <TotemHeaderButtonsRow/>
        <ElevationIntroduction/>
        {account == null && <UnlockButton elevation={elevationTab} /> }
        <ElevationTotemBattle/>
        { account != null && userTotem != null && elevationTab !== ElevationFarmTab.OASIS && <ElevationYieldBet/> }
        { account != null && elevationTab === ElevationFarmTab.DASH && <MultiElevYieldBet/> }
        { elevationTab === ElevationFarmTab.DASH && <MultiElevStaked/> }
        { account != null && userTotem != null && <ElevationWinnings/> }
        { elevationTab === ElevationFarmTab.DASH && <MultiElevWinningsAndClaim/> }
      </HeaderWrapper>
    </HeaderCardsWrapper>
  )
}

export default React.memo(TotemHeader)

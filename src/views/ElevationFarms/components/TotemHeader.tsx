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
import ElevationStakedBreakdown from './ElevationStakedBreakdown'
import TotemHeaderButtonsRow from './TotemHeaderButtonsRow'
import { useWallet } from '@binance-chain/bsc-use-wallet'

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
  margin-top: 124px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  width: 100%;
  height: 100%;
`

const TotemHeader: React.FC = () => {
  const elevationTab = useElevationFarmsTab()
  const userTotem = useElevationTotem(elevationTabToElevation[elevationTab])
  const { account }: { account: string } = useWallet()


  return (
    <HeaderCardsWrapper>
      {/* <Flex flex="1" flexDirection="column" alignItems="center" alignSelf="stretch" justifyContent="center">
        <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
          <ElevationPuck elevation={elevation}>THE {elevation}</ElevationPuck>

          <ElevationInfo />

          <ElevationIntroduction />
            {account == null && <>
                  <UnlockButton elevation={elevation} />
                  <br/>
                  <br/>
            </>}
            {account != null && userTotem == null && (
                <>
                    <SummitButton elevation={elevation} onClick={onPresentSelectTotemModal}>
                        {elevation === Elevation.OASIS ? 'CONFIRM OTTER' : `CHOOSE YOUR TOTEM`}
                    </SummitButton>
                    <br />
                    <br />
                </>
          )}
          <ElevationTimerAndRollover />

          {userTotem != null && !elevationLocked && <FarmTypeSelector />}
        </HeaderWrapper>
      </Flex> */}
      {/* {userTotem != null && ( */}
      <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <TotemHeaderButtonsRow/>
        <ElevationIntroduction/>
        {account == null && <UnlockButton elevation={elevationTab} /> }
        { elevationTab === ElevationFarmTab.DASH && <ElevationStakedBreakdown/> }
        <ElevationTotemBattle/>
        { account != null && userTotem != null && elevationTab !== ElevationFarmTab.OASIS && <ElevationYieldBet/> }
        { account != null && userTotem != null && <ElevationWinnings/> }
      </HeaderWrapper>
    </HeaderCardsWrapper>
  )
}

export default React.memo(TotemHeader)

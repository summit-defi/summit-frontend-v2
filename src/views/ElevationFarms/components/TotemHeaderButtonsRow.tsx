import React from 'react'
import { Elevation, elevationUtils } from 'config/constants/types'
import styled, { css } from 'styled-components'
import { elevationPalette } from 'theme/colors'
import { chunkArray, getBalanceNumber, getFormattedBigNumber, getFullDisplayBalance, groupByAndMap } from 'utils'
import { Text, Flex, Spinner } from 'uikit'
import Totem from './Totem'
import chroma from 'chroma-js'
import BigNumber from 'bignumber.js'
import { clamp, orderBy } from 'lodash'
import { useClaimElevation } from 'hooks/useClaim'
import { useSelectedElevation, useIsElevationLockedUntilRollover, useElevationUserRoundInfo, useFarms, useElevationTotem, useElevationLocked, useSelectedElevationWinningTotem, useTotemSelectionPending } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import SummitButton from 'uikit/components/Button/SummitButton'
import SummitIconButton from 'uikit/components/Button/SummitIconButton'
import ArtworkTotem from './ArtworkTotem'
import useSelectTotemModal from 'uikit/widgets/SelectTotemModal/useSelectTotemModal'
import useTotemWinnersModal from 'uikit/widgets/TotemWinnersModal/useTotemWinnersModal'
import { SpinnerKeyframes } from 'uikit/components/Svg/Icons/Spinner'

const HeaderButtonsRow = styled(Flex)`
  position: absolute;
  top: -96px;
`

const HeaderTotemWrapper = styled.div<{ isLoading: boolean }>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 200px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  align-items: center;
  justify-content: center;
  display: flex;
  opacity: ${({ isLoading}) => isLoading ? 0.75 : 1};

  .spinner {
    fill: white;
    animation: ${SpinnerKeyframes} 1.4s infinite linear;
  }
`

const CrownHistoryIcon = styled.div`
  position: absolute;
  top: -11px;
  left: -10px;
  right: -12px;
  bottom: -11px;
  background-image: url('/images/totemIcons/CROWNTIMER.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
`
const SwitchTotemIcon = styled.div`
  position: absolute;
  top: -11px;
  left: -11px;
  right: -11px;
  bottom: -11px;
  background-image: url('/images/totemIcons/SWITCHTOTEM.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
`

const IconButtonText = styled(Text)`
  position: absolute;
  bottom: -28px;
  left: 0;
  right: 0;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  margin: auto;
`

const TotemIcon = styled.div<{ totemName: string }>`
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  background-image: ${({ totemName }) => `url("/images/totemIcons/${totemName}.png")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 3;
`

const StyledSpinner = styled(Spinner)`
  position: absolute;
  align-self: center;
  filter: drop-shadow(0px 0px 4px black);
`

const TotemHeaderButtonsRow: React.FC = () => {
  const elevation = useSelectedElevation()
  const userTotem = useElevationTotem(elevation)
  const elevationLocked = useElevationLocked(elevation)
  const elevationLockedUntilRollover = useIsElevationLockedUntilRollover()
  const totemSelectionPending = useTotemSelectionPending()

  const isElevationFarm = elevation !== Elevation.OASIS
  const crownedTotem = useSelectedElevationWinningTotem()
  const { onPresentTotemWinnersModal, showTotemWinnersModalButton } = useTotemWinnersModal(elevation)
  const { onPresentSelectTotemModal } = useSelectTotemModal(elevation)

  const handlePresentSelectTotemModal = () => {
    if (elevationLockedUntilRollover) return
    onPresentSelectTotemModal()
  }


  return (
    <HeaderButtonsRow flexDirection="row" justifyContent="center" alignItems="center">
      {userTotem != null && isElevationFarm && (
        <SummitIconButton
          isLocked={elevationLockedUntilRollover}
          isLoading={totemSelectionPending}
          elevation={elevation}
          onClick={handlePresentSelectTotemModal}
        >
          <TotemIcon totemName={elevationUtils.getElevationTotemName(elevation, userTotem)} />
          <SwitchTotemIcon />
          <IconButtonText bold monospace>SWITCH<br/>TOTEM</IconButtonText>
          {totemSelectionPending && <StyledSpinner className="spinner" />}
          {/* {elevationLockedUntilRollover && <StyledLock width="28px" />} */}
        </SummitIconButton>
      )}
      <HeaderTotemWrapper isLoading={totemSelectionPending}>
        <ArtworkTotem
          elevation={elevation}
          totem={userTotem}
          crowned={userTotem === crownedTotem}
          desktopSize="180"
          mobileSize="180"
        />
        {totemSelectionPending && <StyledSpinner className="spinner" />}
      </HeaderTotemWrapper>
      {isElevationFarm && userTotem != null && (
        <SummitIconButton elevation={elevation} onClick={onPresentTotemWinnersModal}>
          <CrownHistoryIcon />
          <IconButtonText bold monospace>PREV<br/>WINNERS</IconButtonText>
        </SummitIconButton>
      )}
    </HeaderButtonsRow>
  )
}

export default React.memo(TotemHeaderButtonsRow)

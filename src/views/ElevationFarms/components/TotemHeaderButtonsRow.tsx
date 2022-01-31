import React from 'react'
import { Elevation, elevationTabToElevation, elevationUtils } from 'config/constants/types'
import styled from 'styled-components'
import { Text, Flex, Spinner, ElevationPuck, ArtworkTotem } from 'uikit'
import { useIsElevationLockedUntilRollover, useTotemSelectionPending, useElevationFarmsTab } from 'state/hooks'
import { useSelectTotemModal } from 'components/SelectTotemModal'
import SummitIconButton from 'uikit/components/Button/SummitIconButton'
import { SpinnerKeyframes } from 'uikit/components/Svg/Icons/Spinner'
import useTotemWinnersModal from 'uikit/widgets/TotemWinnersModal/useTotemWinnersModal'
import { useElevationUserTotemAndCrowned } from 'state/hooksNew'

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
  const elevationTab = useElevationFarmsTab()
  const elevation = elevationTabToElevation[elevationTab]
  const { userTotem, crowned } = useElevationUserTotemAndCrowned(elevation)
  const elevationLockedUntilRollover = useIsElevationLockedUntilRollover(elevation)
  const totemSelectionPending = useTotemSelectionPending()

  const isElevationFarm = elevation !== Elevation.OASIS
  const { onPresentTotemWinnersModal } = useTotemWinnersModal(elevation)
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
      { elevation != null ?
        <HeaderTotemWrapper isLoading={totemSelectionPending}>
          <ArtworkTotem
            elevation={elevation}
            totem={userTotem}
            crowned={crowned}
            desktopSize="180"
            mobileSize="180"
          />
          {totemSelectionPending && <StyledSpinner className="spinner" />}
        </HeaderTotemWrapper> :
        <ElevationPuck elevation='BLUE' top={0}>
          <Text bold fontSize='20px' color='white'>
            FARMING
            <br/>
            DASHBOARD
          </Text>
        </ElevationPuck>
      }
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

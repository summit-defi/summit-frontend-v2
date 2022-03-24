import React, { useCallback, useState } from 'react'
import { Elevation, elevationTabToElevation, elevationUtils } from 'config/constants/types'
import styled from 'styled-components'
import { Text, Flex, Spinner, Lock, ElevationPuck, ArtworkTotem, HighlightedText } from 'uikit'
import { useTotemSelectionPending, useElevationFarmsTab } from 'state/hooks'
import { useSelectTotemModal } from 'components/SelectTotemModal'
import SummitIconButton from 'uikit/components/Button/SummitIconButton'
import { SpinnerKeyframes } from 'uikit/components/Svg/Icons/Spinner'
import useTotemWinnersModal from 'uikit/widgets/TotemWinnersModal/useTotemWinnersModal'
import { RoundStatus, useElevationInteractionsLockedBreakdown, useElevationUserTotemAndCrowned, useUserTotemsAndCrowns } from 'state/hooksNew'
import { pressableMixin } from 'uikit/util/styledMixins'
import { FarmingTab, FarmHeaderTabSelector } from './FarmHeaderTabSelector'

const HeaderButtonsRow = styled(Flex)`
  position: absolute;
  top: 0px;
  width: 318px;
  gap: 12px;
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

const TotemWrapper = styled.div<{ isLoading: boolean }>`
  position: relative;
  align-items: center;
  justify-content: center;
  display: flex;
  opacity: ${({ isLoading}) => isLoading ? 0.75 : 1};

  .spinner {
    fill: white;
    animation: ${SpinnerKeyframes} 1.4s infinite linear;
  }

  ${pressableMixin}
`

const OasisYieldWarsGap = styled.div`
  width: 36px;
  height: 36px;
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

const ElevationName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 16px;
`

const StyledSpinner = styled(Spinner)`
  position: absolute;
  align-self: center;
  filter: drop-shadow(0px 0px 4px black);
`
const StyledLock = styled(Lock)`
  position: absolute;
  align-self: center;
  filter: drop-shadow(0px 0px 4px black);
`

const TotemHeaderButtonsRow: React.FC = () => {
  const elevationTab = useElevationFarmsTab()
  const elevation = elevationTabToElevation[elevationTab]
  const [selectedTab, selectTab] = useState<FarmingTab>(FarmingTab.Farm)
  const { roundStatus } = useElevationInteractionsLockedBreakdown(elevation)
  const totemSwitchDisabled = roundStatus === RoundStatus.RolloverLockout || roundStatus === RoundStatus.RolloverAvailable

  const { onPresentTotemWinnersModal } = useTotemWinnersModal()
  const { onPresentSelectTotemModal } = useSelectTotemModal(elevation)

  const handlePresentSelectTotemModal = useCallback(() => {
    if (totemSwitchDisabled) return
    onPresentSelectTotemModal()
  }, [totemSwitchDisabled, onPresentSelectTotemModal])


  return (
    <HeaderButtonsRow flexDirection="row" justifyContent="center" alignItems="center">
      {/* {userTotem != null && isElevationFarm && (
        <SummitIconButton
          isLocked={totemSwitchDisabled}
          isLoading={totemSelectionPending}
          elevation={elevation}
          onClick={handlePresentSelectTotemModal}
        >
          <TotemIcon totemName={elevationUtils.getElevationTotemName(elevation, userTotem)} />
          <SwitchTotemIcon />
          <IconButtonText bold monospace>SWITCH<br/>TOTEM</IconButtonText>
          {totemSelectionPending && <StyledSpinner className="spinner" />}
          {totemSwitchDisabled && <StyledLock width="28px" />}
        </SummitIconButton>
      )} */}

      <FarmHeaderTabSelector
        selected={selectedTab}
        onSelect={selectTab}
      />


      {/* <HeaderTotemWrapper isLoading={totemSelectionPending}>
        <TotemWrapper isLoading={totemSelectionPending} onClick={() => onPresentTotemWinnersModal({elevation: Elevation.OASIS})}>
          <ArtworkTotem
            elevation={Elevation.OASIS}
            totem={userTotemsAndCrowns[0].userTotem}
            desktopSize="140"
            mobileSize="90"
          />
          {totemSelectionPending && <StyledSpinner className="spinner" />}
          <ElevationName className='elevation-name'>
            <HighlightedText bold color='white' italic fontSize='14px' lineHeight='14px'>THE</HighlightedText>
            <HighlightedText bold color='white' italic fontSize='20px' lineHeight='20px'>{Elevation.OASIS}</HighlightedText>
          </ElevationName>
        </TotemWrapper>
      </HeaderTotemWrapper>



      <OasisYieldWarsGap/>


      <HeaderTotemWrapper isLoading={totemSelectionPending}>
        <TotemWrapper isLoading={totemSelectionPending} onClick={() => onPresentTotemWinnersModal({elevation: Elevation.PLAINS})}>
          <ArtworkTotem
            elevation={Elevation.PLAINS}
            totem={userTotemsAndCrowns[1].userTotem}
            crowned={userTotemsAndCrowns[1].crowned}
            desktopSize="140"
            mobileSize="90"
          />
          {totemSelectionPending && <StyledSpinner className="spinner" />}
          <ElevationName className='elevation-name'>
            <HighlightedText bold color='white' italic fontSize='14px' lineHeight='14px'>THE</HighlightedText>
            <HighlightedText bold color='white' italic fontSize='20px' lineHeight='20px'>{Elevation.PLAINS}</HighlightedText>
          </ElevationName>
        </TotemWrapper>
        <TotemWrapper isLoading={totemSelectionPending} onClick={() => onPresentTotemWinnersModal({elevation: Elevation.MESA})}>
          <ArtworkTotem
            elevation={Elevation.MESA}
            totem={userTotemsAndCrowns[2].userTotem}
            crowned={userTotemsAndCrowns[2].crowned}
            desktopSize="140"
            mobileSize="90"
          />
          {totemSelectionPending && <StyledSpinner className="spinner" />}
          <ElevationName className='elevation-name'>
            <HighlightedText bold color='white' italic fontSize='14px' lineHeight='14px'>THE</HighlightedText>
            <HighlightedText bold color='white' italic fontSize='20px' lineHeight='20px'>{Elevation.MESA}</HighlightedText>
          </ElevationName>
        </TotemWrapper>
        <TotemWrapper isLoading={totemSelectionPending} onClick={() => onPresentTotemWinnersModal({elevation: Elevation.SUMMIT})}>
          <ArtworkTotem
            elevation={Elevation.SUMMIT}
            totem={userTotemsAndCrowns[3].userTotem}
            crowned={userTotemsAndCrowns[3].crowned}
            desktopSize="140"
            mobileSize="90"
          />
          {totemSelectionPending && <StyledSpinner className="spinner" />}
          <ElevationName className='elevation-name'>
            <HighlightedText bold color='white' italic fontSize='14px' lineHeight='14px'>THE</HighlightedText>
            <HighlightedText bold color='white' italic fontSize='20px' lineHeight='20px'>{Elevation.SUMMIT}</HighlightedText>
          </ElevationName>
        </TotemWrapper>
      </HeaderTotemWrapper> */}
      {/* {isElevationFarm && userTotem != null && (
        <SummitIconButton elevation={elevation} onClick={onPresentTotemWinnersModal}>
          <CrownHistoryIcon />
          <IconButtonText bold monospace>PREV<br/>WINNERS</IconButtonText>
        </SummitIconButton>
      )} */}
    </HeaderButtonsRow>
  )
}

export default React.memo(TotemHeaderButtonsRow)

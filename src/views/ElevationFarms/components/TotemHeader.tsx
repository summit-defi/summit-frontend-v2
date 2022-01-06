import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Elevation, elevationUtils } from 'config/constants/types'
import { ElevationPuck, Flex, Text } from 'uikit'
import {
  useElevationLocked,
  useIsElevationLockedUntilRollover,
  useMediaQuery,
  useSelectedElevation,
  useSelectedElevationWinningTotem,
} from 'state/hooks'
import ElevationInfo from './ElevationInfo'
import ElevationTimerAndRollover from './ElevationTimerAndRollover'
import ElevationFarmingExplanation from './ElevationFarmingExplanation'
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
  padding-top: 124px;
  margin-top: 150px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  width: 100%;
  height: 100%;
`

const HeaderButtonsRow = styled(Flex)`
  position: absolute;
  top: -106px;
`

const HeaderTotemWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 200px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
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

const MobileButtonsRow = styled.div`
  position: relative;
  width: 100%;
  margin-top: -48px;
  margin-bottom: 48px;
`

const MobileLeftSummitIconButton = styled(SummitIconButton)`
  position: absolute;
  left: -16px;
  top: 0px;
`

const MobileRightSummitIconButton = styled(SummitIconButton)`
  position: absolute;
  right: -16px;
  top: 0px;
`

interface Props {
  account: string
}

const TotemHeader: React.FC<Props> = ({ account }) => {
  const userTotem = 0
  const elevation = useSelectedElevation()
  const elevationLocked = useElevationLocked(elevation)
  const elevationLockedUntilRollover = useIsElevationLockedUntilRollover()

  const [mobileSelectedCard, setMobileSelectedCard] = useState(MobileSelectedCard.ElevationCard)

  const mobileHeaderCardSelector = useCallback(() => {
    return (
      elevation != null && (
        <MobileHeaderCardSelector
          userTotem={userTotem}
          elevation={elevation}
          selectMobileHeaderCard={setMobileSelectedCard}
        />
      )
    )
  }, [userTotem, elevation, setMobileSelectedCard])

  const isElevationFarm = elevation !== Elevation.OASIS
  const crownedTotem = useSelectedElevationWinningTotem()
  const { onPresentTotemWinnersModal, showTotemWinnersModalButton } = useTotemWinnersModal(elevation)
  const { onPresentSelectTotemModal } = useSelectTotemModal(elevation)

  const handlePresentSelectTotemModal = () => {
    if (elevationLockedUntilRollover) return
    onPresentSelectTotemModal()
  }

  // const isMobile = useMediaQuery('(max-width: 986px)')

  // if (isMobile) {
  //   return (
  //     <HeaderCardsWrapper>
  //       <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
  //         {mobileHeaderCardSelector()}

  //         {mobileSelectedCard === MobileSelectedCard.ElevationCard ? (
  //           <>
  //             <ElevationInfo />

  //             <ElevationFarmingExplanation />
  //             {account == null &&
  //                 <UnlockButton elevation={elevation} />
  //             }
  //             {account != null && userTotem == null && (
  //               <>
  //                 <SummitButton elevation={elevation} onClick={onPresentSelectTotemModal}>
  //                   {elevation === Elevation.OASIS ? 'SAY HELLO TO THE OTTER' : `CHOOSE YOUR TOTEM`}
  //                 </SummitButton>
  //                 <br />
  //                 <br />
  //               </>
  //             )}

  //             <ElevationTimerAndRollover />

  //             {userTotem != null && !elevationLocked && <FarmTypeSelector />}
  //           </>
  //         ) : (
  //           <>
  //             {isElevationFarm && (
  //               <MobileButtonsRow>
  //                 {userTotem != null && (
  //                   <MobileLeftSummitIconButton
  //                     isLocked={false}
  //                     elevation={elevation}
  //                     onClick={handlePresentSelectTotemModal}
  //                   >
  //                     <TotemIcon totemName={elevationUtils.getElevationTotemName(elevation, userTotem)} />
  //                     <IconButtonText bold monospace>SWITCH<br/>TOTEM</IconButtonText>
  //                     <SwitchTotemIcon />
  //                     {/* <StyledLock width="28px" /> */}
  //                   </MobileLeftSummitIconButton>
  //                 )}
  //                 {showTotemWinnersModalButton && (
  //                   <MobileRightSummitIconButton elevation={elevation} onClick={onPresentTotemWinnersModal}>
  //                     <CrownHistoryIcon />
  //                     <IconButtonText bold monospace>TOTEM<br/>STATS</IconButtonText>
  //                   </MobileRightSummitIconButton>
  //                 )}
  //               </MobileButtonsRow>
  //             )}
  //             <ElevationUserRoundInfo />
  //           </>
  //         )}
  //       </HeaderWrapper>
  //     </HeaderCardsWrapper>
  //   )
  // }

  return (
    <HeaderCardsWrapper>
      {/* <Flex flex="1" flexDirection="column" alignItems="center" alignSelf="stretch" justifyContent="center">
        <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
          <ElevationPuck elevation={elevation}>THE {elevation}</ElevationPuck>

          <ElevationInfo />

          <ElevationFarmingExplanation />
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
          {elevation != null && (
            <HeaderButtonsRow flexDirection="row" justifyContent="center" alignItems="center">
              {userTotem != null && isElevationFarm && (
                <SummitIconButton
                  isLocked={false}
                  elevation={elevation}
                  onClick={onPresentSelectTotemModal}
                >
                  <TotemIcon totemName={elevationUtils.getElevationTotemName(elevation, userTotem)} />
                  <SwitchTotemIcon />
                  <IconButtonText bold monospace>SWITCH<br/>TOTEM</IconButtonText>
                  {/* {elevationLockedUntilRollover && <StyledLock width="28px" />} */}
                </SummitIconButton>
              )}
              <HeaderTotemWrapper>
                <ArtworkTotem
                  elevation={elevation}
                  totem={userTotem}
                  crowned={userTotem === crownedTotem}
                  desktopSize="200"
                  mobileSize="200"
                />
              </HeaderTotemWrapper>
              {isElevationFarm && (
                <SummitIconButton elevation={elevation} onClick={onPresentTotemWinnersModal}>
                  <CrownHistoryIcon />
                  <IconButtonText bold monospace>TOTEM<br/>STATS</IconButtonText>
                </SummitIconButton>
              )}
            </HeaderButtonsRow>
          )}

          <BoundedProgressBar
            title='TEST'
            minTitle='NOV 4'
            maxTitle='NOV 10'
            minVal='0%'
            maxVal='5%'
            currVal='3%'
            progress={0.6}
            elevation={elevation}
          />

          <ElevationUserRoundInfo />
        </HeaderWrapper>
      {/* )} */}
    </HeaderCardsWrapper>
  )
}

export default React.memo(TotemHeader)

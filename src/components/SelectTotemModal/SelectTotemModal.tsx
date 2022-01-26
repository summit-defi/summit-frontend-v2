import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'
import { useSelectTotemAndOrSafetyFactor } from 'hooks/useSelectTotem'
import React, { useCallback, useState } from 'react'
import { useElevationUserRoundInfo } from 'state/hooks'
import styled, { keyframes } from 'styled-components'
import { getPaletteGradientFarmCardBackground } from 'utils'
import { RewardsWillBeClaimedType, useRewardsWillBeClaimedModal } from 'components/RewardsWillBeClaimedModal'
import InitialSelectionTotems from './InitialSelectionTotems'
import ConvictionSlider from './ConvictionSlider'
import { Flex, Modal, ArtworkTotem, HighlightedText, Text, SummitButton } from 'uikit'

interface Props {
  elevation: Elevation
  userTotem: number | null
  preselectedTotem?: number
  alsoSelectFaith?: boolean
  existingFaith?: number
  onDismiss?: () => void
}

const RainbowLight = keyframes`
0% {
  background-position: 0% 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0% 50%;
}
`

const StyledCardAccent = styled.div<{ elevationBackground: string }>`
  background: ${({ elevationBackground }) => elevationBackground};

  background-size: 200% 200%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 200px;
  filter: blur(30px);
  position: absolute;
  top: 3px;
  right: 3px;
  bottom: 3px;
  left: 3px;
  z-index: -1;
`

const TotemPadding = styled.div`
  margin: 12px;
  margin-top: 0px;
  position: relative;
  z-index: -1;
`

const ConvictionSliderWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 12px;
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
`

const SelectTotemModal: React.FC<Props> = ({
  elevation,
  userTotem,
  preselectedTotem = null,
  alsoSelectFaith = false,
  existingFaith = null,
  onDismiss = () => null,
}) => {
  const { userEarned } = useElevationUserRoundInfo(elevation)
  const presentRewardsWillBeClaimedModal = useRewardsWillBeClaimedModal(elevation, userEarned || new BigNumber(0), 'Deposit', RewardsWillBeClaimedType.FullElevation)

  const { onSelectTotemAndOrSafetyFactor } = useSelectTotemAndOrSafetyFactor()
  const [totemToConfirm, setTotemToConfirm] = useState<number | null>(
    elevation === Elevation.OASIS ? 0 : preselectedTotem,
  )
  const [faithToConfirm, setFaithToConfirm] = useState<number | null>(
    existingFaith
  )
  const elevationBackground = getPaletteGradientFarmCardBackground(elevation)
  const handleSelectTotem = useCallback(async () => {
    onDismiss()
    presentRewardsWillBeClaimedModal(
      { transactionToConfirm: () => onSelectTotemAndOrSafetyFactor(
          elevation,
          totemToConfirm,
          faithToConfirm === existingFaith ? null : faithToConfirm
        ) 
      }
    )
  }, [onSelectTotemAndOrSafetyFactor, elevation, totemToConfirm, faithToConfirm, existingFaith, onDismiss, presentRewardsWillBeClaimedModal])
  const totemToConfirmName = elevationUtils.getElevationTotemName(elevation, totemToConfirm, false)
  const elevationName = `${elevation}`


  const handleSelectTotemToConfirm = (totem: number) => {
    setTotemToConfirm(totem)
  }

  const updateConvictionText = (!alsoSelectFaith || existingFaith === faithToConfirm) ?
    null :
    '(WITH CONVICTION)'

  return (
    <Modal
      title={totemToConfirm != null ? 'CONFIRM|br|TOTEM:' : 'SELECT|br|TOTEM:'}
      onDismiss={onDismiss}
      headerless
      elevationCircleHeader={elevation}
    >
      {totemToConfirm != null ? (
        <Flex alignItems="center" flexDirection="column">
          <HighlightedText summitPalette={elevation} header>
            THE {totemToConfirmName}
          </HighlightedText>
          <HighlightedText summitPalette={elevation} header={false} mb="24px">
            WILL BE YOUR {elevationName} GUIDE
          </HighlightedText>
          <TotemPadding>
            {elevation !== Elevation.EXPEDITION && <StyledCardAccent elevationBackground={elevationBackground} />}
            <ArtworkTotem elevation={elevation} totem={totemToConfirm} desktopSize="200" mobileSize="200" />
          </TotemPadding>
          { alsoSelectFaith &&
            <>
              <Text bold monospace small italic mt='-36px' textAlign='center' lineHeight='14px'>
                Update your CONVICTION
                <br/>
                in {totemToConfirmName} (Optional)
                </Text>
              <ConvictionSliderWrapper>
                <ConvictionSlider
                    existingConviction={existingFaith}
                    setConviction={setFaithToConfirm}
                />
              </ConvictionSliderWrapper>
            </>
          }
          <SummitButton width='200px' padding='0px' mt='12px' summitPalette={elevation} onClick={handleSelectTotem}>
            CONFIRM
            {updateConvictionText != null &&
              <>
                <br/>
                {updateConvictionText}
              </>
            }
          </SummitButton>
        </Flex>
      ) : (
        <Flex alignItems="center" flexDirection="column">
          <Text textAlign="center" mb="18px">
            Totems compete for the pot of staking yield,
            <br />
            but only one can win each round.
            <br />
            Your yield contributed is moved to your new totem.
          </Text>
          <InitialSelectionTotems elevation={elevation} userTotem={userTotem} onSelect={handleSelectTotemToConfirm} />
        </Flex>
      )}
    </Modal>
  )
}

export default SelectTotemModal

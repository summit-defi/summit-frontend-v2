import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'
import { useSelectTotemAndOrSafetyFactor } from 'hooks/useSelectTotem'
import React, { useCallback, useState } from 'react'
import { useElevationUserRoundInfo } from 'state/hooks'
import styled, { keyframes } from 'styled-components'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { HighlightedText, Text } from 'uikit/components/Text'
import { getElevationGradientFarmCardBackground } from 'utils'
import ArtworkTotem from 'views/ElevationFarms/components/ArtworkTotem'
import InitialSelectionTotems from 'views/ElevationFarms/components/InitialSelectionTotems'
import { RewardsWillBeClaimedType, useRewardsWillBeClaimedModal } from 'views/ElevationFarms/components/RewardsWillBeClaimedModal'
import { Modal } from '../Modal'

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
  margin: 24px;
  position: relative;
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
  const elevationBackground = getElevationGradientFarmCardBackground(elevation)
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

  return (
    <Modal
      title={totemToConfirm != null ? 'CONFIRM|br|TOTEM:' : 'SELECT|br|TOTEM:'}
      onDismiss={onDismiss}
      headerless
      elevationCircleHeader={elevation}
    >
      {totemToConfirm != null ? (
        <Flex alignItems="center" flexDirection="column">
          <HighlightedText elevation={elevation} header mb="16px">
            THE {totemToConfirmName}
          </HighlightedText>
          <HighlightedText elevation={elevation} header={false} mb="36px">
            WILL BE YOUR {elevationName} GUIDE
          </HighlightedText>
          <TotemPadding>
            {elevation !== Elevation.EXPEDITION && <StyledCardAccent elevationBackground={elevationBackground} />}
            <ArtworkTotem elevation={elevation} totem={totemToConfirm} desktopSize="200" mobileSize="200" />
          </TotemPadding>
          <SummitButton elevation={elevation} onClick={handleSelectTotem}>
            CONFIRM
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

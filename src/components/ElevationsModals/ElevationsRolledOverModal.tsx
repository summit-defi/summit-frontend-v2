import React from 'react'
import { Elevation, elevationUtils, SummitPalette } from 'config/constants/types'
import styled from 'styled-components'
import { Modal, Flex, ModalActions, SummitButton } from 'uikit'
import { useWinningTotems } from 'state/hooks'
import { RolledOverElevation } from './RolledOverElevation'

interface Props {
  elevations?: Elevation[]
  markShown: () => void
  onDismiss?: () => void
}

const WinnersWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  flex-shrink: 1;
  gap: 12px;
`

export const ElevationsRolledOverModal: React.FC<Props> = ({ elevations = [], markShown, onDismiss }) => {
  const winningTotems = useWinningTotems()
  const multiWin = elevations.length > 1

  const dismissModal = () => {
    markShown()
    onDismiss()
  }

  return (
    <Modal
      title="WINNER!"
      onDismiss={dismissModal}
      headerless
      elevationGlow={SummitPalette.GOLD}
      elevationCircleHeader={elevations.length > 1 ? 'Summit DeFi' : elevations[0]}
    >
      <Flex alignItems="center" flexDirection="column">
        <WinnersWrapper>
          {elevations.map((elevation) => (
            <RolledOverElevation
              key={elevation}
              elevation={elevation}
              winningTotem={winningTotems[elevationUtils.toInt(elevation)]}
              multiWin={multiWin}
            />
          ))}
        </WinnersWrapper>

        <ModalActions>
          <SummitButton secondary onClick={dismissModal}>
            CLOSE
          </SummitButton>
        </ModalActions>
      </Flex>
    </Modal>
  )
}

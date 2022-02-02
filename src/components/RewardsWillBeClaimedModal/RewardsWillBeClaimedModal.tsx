/* eslint-disable react/no-array-index-key */
import { Elevation } from 'config/constants/types'
import React from 'react'
import { getFormattedBigNumber } from 'utils'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, Modal, ModalActions, HighlightedText, Text, SummitButton  } from 'uikit'

export enum RewardsWillBeClaimedType {
  Farm = 'Farm',
  FullElevation = 'FullElevation',
  Elevate = 'Elevate'
}

const HorizontalDisplayBalance = styled(Flex)`
  align-items: center;
  justify-content: center;
`

interface Props {
  elevation: Elevation
  claimable?: BigNumber
  transactionName: string
  rewardClaimType: RewardsWillBeClaimedType
  elevateInfo?: {
    sourceElevation: Elevation,
    targetElevation: Elevation,
    sourceEarned: BigNumber,
    targetEarned: BigNumber,
  },
  transactionToConfirm?: () => () => void
  onDismiss?: () => void
}

export const RewardsWillBeClaimedModal: React.FC<Props> = ({
  elevation,
  claimable,
  transactionName,
  rewardClaimType,
  elevateInfo,
  transactionToConfirm,
  onDismiss = () => null,
}) => {


  const handleConfirm = () => {
    if (transactionToConfirm != null) transactionToConfirm()
    onDismiss()
  }

  switch(rewardClaimType) {
    case RewardsWillBeClaimedType.Elevate:
      if ((elevateInfo.sourceEarned || new BigNumber(0)).plus(elevateInfo.targetEarned || new BigNumber(0)).isEqualTo(0)) {
        handleConfirm()
      }
      break
      
    default:
    case RewardsWillBeClaimedType.Farm:
    case RewardsWillBeClaimedType.FullElevation:
      if (claimable.isEqualTo(0)) {
        handleConfirm()
      }
      break
  }

  return (
    <Modal title="REWARDS TO|br|CLAIM" onDismiss={onDismiss} headerless elevationCircleHeader={elevateInfo?.targetElevation || elevation}>
      { (rewardClaimType === RewardsWillBeClaimedType.Farm || rewardClaimType === RewardsWillBeClaimedType.FullElevation) &&
        <>
          <Text bold monospace textAlign='center'>This {transactionName} will also<br/>claim your available</Text>
          <HighlightedText summitPalette={elevation} gold fontSize='24px' mt='12px'>{getFormattedBigNumber(claimable)}</HighlightedText>
          <HighlightedText summitPalette={elevation} gold fontSize='16px' mb='12px'>SUMMIT</HighlightedText>
          <Text bold monospace textAlign='center'>{elevation === Elevation.OASIS ? 'earnings' : 'rewards'} from the {rewardClaimType === RewardsWillBeClaimedType.Farm ? 'Farm' : elevation}</Text>
        </>
      }
      { rewardClaimType === RewardsWillBeClaimedType.Elevate &&
        <>
          <Text bold monospace mb='24px' textAlign='center'>
            Elevating will claim your earned
            <br/>
            rewards from both the source and target farms:
          </Text>
          { (elevateInfo?.sourceEarned || new BigNumber(0)).isGreaterThan(0) &&
            <HorizontalDisplayBalance>
              <HighlightedText summitPalette={elevateInfo.sourceElevation} fontSize='16px' mr='16px'>THE {elevateInfo.sourceElevation}: </HighlightedText>
              <HighlightedText summitPalette={elevateInfo.sourceElevation} fontSize='24px' mb='6px' mr='8px'>{getFormattedBigNumber(elevateInfo.sourceEarned)}</HighlightedText>
              <HighlightedText summitPalette={elevateInfo.sourceElevation} fontSize='16px'>SUMMIT</HighlightedText>
            </HorizontalDisplayBalance>
          }
          { (elevateInfo?.targetEarned || new BigNumber(0)).isGreaterThan(0) &&
            <HorizontalDisplayBalance>
              <HighlightedText summitPalette={elevateInfo.targetElevation} fontSize='16px' mr='16px'>THE {elevateInfo.targetElevation}: </HighlightedText>
              <HighlightedText summitPalette={elevateInfo.targetElevation} fontSize='24px' mb='6px' mr='8px'>{getFormattedBigNumber(elevateInfo.targetEarned)}</HighlightedText>
              <HighlightedText summitPalette={elevateInfo.targetElevation} fontSize='16px'>SUMMIT</HighlightedText>
            </HorizontalDisplayBalance>
          }
        </>
      }
      { [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT].includes(elevation) && rewardClaimType !== RewardsWillBeClaimedType.FullElevation &&
        <Text bold monospace italic textAlign='center' small mt='24px'>
          This will only claim rewards from
          <br/>
          THIS specific farm at the {elevation}.
          <br/>
          It will not claim rewards from other farms.
        </Text>
      }
      <ModalActions>
        <SummitButton elevation={elevation} secondary onClick={handleConfirm}>
          CONFIRM
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

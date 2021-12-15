/* eslint-disable react/no-array-index-key */
import { Elevation } from 'config/constants/types'
import React from 'react'
import { Modal, Flex, HighlightedText, Text } from 'uikit'
import { getFormattedBigNumber } from 'utils'
import BigNumber from 'bignumber.js'
import ModalActions from 'components/ModalActions'
import SummitButton from 'uikit/components/Button/SummitButton'
import styled from 'styled-components'

export enum RewardsWillBeHarvestedType {
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
  earnedReward?: BigNumber
  transactionName: string
  rewardHarvestType: RewardsWillBeHarvestedType
  elevateInfo?: {
    sourceElevation: Elevation,
    targetElevation: Elevation,
    sourceEarned: BigNumber,
    targetEarned: BigNumber,
  },
  transactionToConfirm?: () => () => void
  onDismiss?: () => void
}

export const RewardsWillBeHarvestedModal: React.FC<Props> = ({
  elevation,
  earnedReward,
  transactionName,
  rewardHarvestType,
  elevateInfo,
  transactionToConfirm,
  onDismiss = () => null,
}) => {


  const handleConfirm = () => {
    if (transactionToConfirm != null) transactionToConfirm()
    onDismiss()
  }

  switch(rewardHarvestType) {
    case RewardsWillBeHarvestedType.Elevate:
      if ((elevateInfo.sourceEarned || new BigNumber(0)).plus(elevateInfo.targetEarned || new BigNumber(0)).isEqualTo(0)) {
        handleConfirm()
      }
      break
      
    default:
    case RewardsWillBeHarvestedType.Farm:
    case RewardsWillBeHarvestedType.FullElevation:
      if (earnedReward.isEqualTo(0)) {
        handleConfirm()
      }
      break
  }

  return (
    <Modal title="REWARDS TO|br|HARVEST" onDismiss={onDismiss} headerless elevationCircleHeader={elevateInfo?.targetElevation || elevation}>
      { (rewardHarvestType === RewardsWillBeHarvestedType.Farm || rewardHarvestType === RewardsWillBeHarvestedType.FullElevation) &&
        <>
          <Text bold monospace textAlign='center'>This {transactionName} will also<br/>harvest your available</Text>
          <HighlightedText elevation={elevation} gold fontSize='24px' mt='12px'>{getFormattedBigNumber(earnedReward)}</HighlightedText>
          <HighlightedText elevation={elevation} gold fontSize='16px' mb='12px'>SUMMIT</HighlightedText>
          <Text bold monospace textAlign='center'>{elevation === Elevation.OASIS ? 'earnings' : 'rewards'} from the {rewardHarvestType === RewardsWillBeHarvestedType.Farm ? 'Farm' : elevation}</Text>
        </>
      }
      { rewardHarvestType === RewardsWillBeHarvestedType.Elevate &&
        <>
          <Text bold monospace mb='24px' textAlign='center'>
            Elevating will harvest your earned
            <br/>
            rewards from both the source and target farms:
          </Text>
          { (elevateInfo?.sourceEarned || new BigNumber(0)).isGreaterThan(0) &&
            <HorizontalDisplayBalance>
              <HighlightedText elevation={elevateInfo.sourceElevation} fontSize='16px' mr='16px'>THE {elevateInfo.sourceElevation}: </HighlightedText>
              <HighlightedText elevation={elevateInfo.sourceElevation} fontSize='24px' mb='6px' mr='8px'>{getFormattedBigNumber(elevateInfo.sourceEarned)}</HighlightedText>
              <HighlightedText elevation={elevateInfo.sourceElevation} fontSize='16px'>SUMMIT</HighlightedText>
            </HorizontalDisplayBalance>
          }
          { (elevateInfo?.targetEarned || new BigNumber(0)).isGreaterThan(0) &&
            <HorizontalDisplayBalance>
              <HighlightedText elevation={elevateInfo.targetElevation} fontSize='16px' mr='16px'>THE {elevateInfo.targetElevation}: </HighlightedText>
              <HighlightedText elevation={elevateInfo.targetElevation} fontSize='24px' mb='6px' mr='8px'>{getFormattedBigNumber(elevateInfo.targetEarned)}</HighlightedText>
              <HighlightedText elevation={elevateInfo.targetElevation} fontSize='16px'>SUMMIT</HighlightedText>
            </HorizontalDisplayBalance>
          }
        </>
      }
      { [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT].includes(elevation) && rewardHarvestType !== RewardsWillBeHarvestedType.FullElevation &&
        <Text bold monospace italic textAlign='center' fontSize='12px' mt='24px'>
          This will only harvest rewards from
          <br/>
          THIS specific farm at the {elevation}.
          <br/>
          It will not harvest rewards from other farms.
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

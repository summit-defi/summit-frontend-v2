import React from 'react'
import { useModal } from 'uikit'
import { RewardsWillBeHarvestedModal, RewardsWillBeHarvestedType } from './RewardsWillBeHarvestedModal'
import { Elevation } from 'config/constants/types'
import BigNumber from 'bignumber.js'


export const useRewardsWillBeHarvestedModal = (elevation: Elevation, claimable: BigNumber, transactionName, rewardHarvestType: RewardsWillBeHarvestedType) => {
  const [onPresentRewardsWillBeHarvestedModal] = useModal(
    <RewardsWillBeHarvestedModal
      elevation={elevation}
      claimable={claimable}
      transactionName={transactionName}
      rewardHarvestType={rewardHarvestType}
    />,
  )
  return onPresentRewardsWillBeHarvestedModal
}

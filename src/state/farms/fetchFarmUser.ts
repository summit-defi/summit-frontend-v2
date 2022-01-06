import BigNumber from 'bignumber.js'
import { getFarmConfigs, getFarmTokens } from 'config/constants'
import { Elevation, elevationUtils, FarmConfig, ForceElevationRetired } from 'config/constants/types'
import {
  getCartographerAddress,
  retryableMulticall,
  abi,
  groupByAndMap,
  getCartographerOasisAddress,
  getSubCartographerAddress,
} from 'utils'
import { getFarmAllElevationsIterable, getFarmOnlyElevationsIterable } from 'utils/farmId'

export const fetchFarmUserData = async (account: string, farmConfigs: FarmConfig[]) => {
  const farmElevsIterable = getFarmAllElevationsIterable(farmConfigs)

  const calls = farmElevsIterable.map(({ elevation, farmToken }) => [
    {
      address: getSubCartographerAddress(elevation),
      name: 'userInfo',
      params: [farmToken, account]
    },
    {
      address: getSubCartographerAddress(elevation),
      name: 'poolClaimableRewards',
      params: [farmToken, account]
    },
    {
      address: getSubCartographerAddress(elevation),
      name: elevation === Elevation.OASIS ? 'poolClaimableRewards' : 'poolYieldContributed',
      params: [farmToken, account]
    }
  ]).flat()

  const res = await retryableMulticall(abi.SubCartUserDataShared, calls, 'fetchFarmUserData')

  const userDataObject = groupByAndMap(
    farmConfigs,
    (farm) => farm.symbol,
    (farm, index) => ({
      [Elevation.OASIS]: {},
      [Elevation.PLAINS]: {},
      [Elevation.MESA]: {},
      [Elevation.SUMMIT]: {},
    })
  )

  if (res == null) return userDataObject

  farmElevsIterable.forEach(({ elevation, symbol }, index) => {
    userDataObject[symbol][elevation] = {
      stakedBalance: new BigNumber(res[index * 3 + 0].staked._hex),
      claimable: new BigNumber(res[index * 3 + 1][0]._hex),
      yieldContributed: new BigNumber(res[index * 3 + 2][0]._hex),
    }
  })

  return userDataObject
}

export const fetchElevClaimableRewards = async (account: string) => {
  const calls = elevationUtils.all.map((elevation) => ({
    address: getSubCartographerAddress(elevation),
    name: 'elevClaimableRewards',
    params: [account]
  }))

  const res = await retryableMulticall(abi.cartographerOasis, calls, 'fetchElevClaimableRewards')

  return groupByAndMap(
    elevationUtils.all,
    (elevation) => elevation,
    (_, index) => res == null ? new BigNumber(0) : new BigNumber(res[index][0]._hex)
  )
}

export const fetchElevPotentialWinnings = async (account: string) => {
  const calls = elevationUtils.elevationOnly.map((elevation) => ({
    address: getSubCartographerAddress(elevation),
    name: 'elevPotentialWinnings',
    params: [account]
  }))

  const res = await retryableMulticall(abi.cartographerElevation, calls, 'fetchElevPotentialWinnings')

  const potentialWinnings = {
    [Elevation.OASIS]: {
      yieldContributed: new BigNumber(0),
      potentialWinnings: new BigNumber(0)
    }
  }

  if (res == null) return potentialWinnings
  
  elevationUtils.elevationOnly.forEach((elevation, index) => {
    potentialWinnings[elevation] = {
      yieldContributed: new BigNumber(res[index][0]._hex),
      potentialWinnings: new BigNumber(res[index][1]._hex),
    }
  })

  return potentialWinnings
}

export const fetchElevationsRoundRewards = async (farmConfigs: FarmConfig[]) => {
  const onlyElevationsIters = getFarmOnlyElevationsIterable(farmConfigs)

  const calls = onlyElevationsIters.map(({ elevation, farmToken }) => ({
    address: getSubCartographerAddress(elevation),
    name: 'totemRoundRewards',
    params: [farmToken],
  }))

  const res = await retryableMulticall(abi.cartographerElevation, calls, 'fetchElevationsRoundRewards')

  const elevationTotemRoundRewards = {
    [Elevation.OASIS]: {
      roundRewards: new BigNumber(0),
      totemRoundRewards: [],
    },
    [Elevation.PLAINS]: {
      roundRewards: new BigNumber(0),
      totemRoundRewards: [],
    },
    [Elevation.MESA]: {
      roundRewards: new BigNumber(0),
      totemRoundRewards: [],
    },
    [Elevation.SUMMIT]: {
      roundRewards: new BigNumber(0),
      totemRoundRewards: [],
    },
  }

  if (res == null) return elevationTotemRoundRewards

  onlyElevationsIters.forEach(({ elevation }, farmIndex) => {
    const [roundRewardsDirty, ...totemRoundRewardsDirty] = res[farmIndex][0]
    const roundRewards = new BigNumber(roundRewardsDirty ? roundRewardsDirty._hex : 0)
    const totemsRoundRewards = (totemRoundRewardsDirty || []).map((reward) => new BigNumber(reward._hex))

    elevationTotemRoundRewards[elevation] = {
      roundRewards: (elevationTotemRoundRewards[elevation].roundRewards).plus(roundRewards),
      totemRoundRewards: totemsRoundRewards.map((totemRewards, totemIndex) =>
        (elevationTotemRoundRewards[elevation].totemRoundRewards[totemIndex] || new BigNumber(0))
          .plus(totemRewards),
      ),
    }
  })

  return elevationTotemRoundRewards
}

import BigNumber from 'bignumber.js'
import { BN_ZERO, Elevation, elevationUtils, FarmConfig } from 'config/constants/types'
import {
  retryableMulticall,
  abi,
  groupByAndMap,
  getSubCartographerAddress,
  getSummitGlacierAddress,
  getCartographerAddress,
} from 'utils'
import { getFarmAllElevationsIterable, getFarmAllTokensIterable, getFarmOnlyElevationsIterable } from 'utils/farms'

export const fetchFarmUserData = async (account: string, farmConfigs: FarmConfig[]) => {
  const farmElevsIterable = getFarmAllElevationsIterable(farmConfigs)
  const tokensIterable = getFarmAllTokensIterable(farmConfigs)

  const tokenCalls = tokensIterable.map((farmToken) => ({
    address: getCartographerAddress(),
    name: 'bonusBP',
    params: [account, farmToken]
  }))
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

  const [tokensRes, farmsRes] = await Promise.all([
    retryableMulticall(abi.cartographer, tokenCalls, 'fetchFarmUserData_tokenCalls'),
    retryableMulticall(abi.SubCartUserDataShared, calls, 'fetchFarmUserData_farmCalls')
  ])

  const tokenBonuses = groupByAndMap(
    tokensIterable,
    (farmToken) => farmToken,
    (_, tokenIndex) => tokensRes != null ? tokensRes[tokenIndex][0] : 0
  )

  const userDataObject = groupByAndMap(
    farmConfigs,
    (farm) => farm.symbol,
    () => ({
      [Elevation.OASIS]: {},
      [Elevation.PLAINS]: {},
      [Elevation.MESA]: {},
      [Elevation.SUMMIT]: {},
    })
  )

  if (farmsRes == null) return userDataObject

  farmElevsIterable.forEach(({ elevation, symbol, farmToken }, index) => {
    const claimable = new BigNumber(farmsRes[index * 3 + 1][0]._hex)
    userDataObject[symbol][elevation] = {
      stakedBalance: new BigNumber(farmsRes[index * 3 + 0].staked._hex),
      claimable,
      bonusBP: tokenBonuses[farmToken],
      claimableBonus: claimable.times(tokenBonuses[farmToken]).dividedBy(10000),
      yieldContributed: new BigNumber(farmsRes[index * 3 + 2][0]._hex),
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
    (_, index) => res == null ? BN_ZERO : new BigNumber(res[index][0]._hex)
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
      yieldContributed: BN_ZERO,
      potentialWinnings: BN_ZERO
    },
    [Elevation.PLAINS]: {
      yieldContributed: BN_ZERO,
      potentialWinnings: BN_ZERO
    },
    [Elevation.MESA]: {
      yieldContributed: BN_ZERO,
      potentialWinnings: BN_ZERO
    },
    [Elevation.SUMMIT]: {
      yieldContributed: BN_ZERO,
      potentialWinnings: BN_ZERO
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
      roundRewards: BN_ZERO,
      totemRoundRewards: [],
      totemMultipliers: [1],
    },
    [Elevation.PLAINS]: {
      roundRewards: BN_ZERO,
      totemRoundRewards: [],
      totemMultipliers: [2, 2],
    },
    [Elevation.MESA]: {
      roundRewards: BN_ZERO,
      totemRoundRewards: [],
      totemMultipliers: [5, 5, 5, 5, 5],
    },
    [Elevation.SUMMIT]: {
      roundRewards: BN_ZERO,
      totemRoundRewards: [],
      totemMultipliers: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
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
        (elevationTotemRoundRewards[elevation].totemRoundRewards[totemIndex] || BN_ZERO)
          .plus(totemRewards),
      ),
    }
  })

  onlyElevationsIters.forEach(({ elevation }) => {
    elevationTotemRoundRewards[elevation].totemMultipliers = elevationTotemRoundRewards[elevation].totemRoundRewards.map((totemRew) => {
      return elevationTotemRoundRewards[elevation].roundRewards.isEqualTo(0) ?
        0 : 
        elevationTotemRoundRewards[elevation].roundRewards.dividedBy(totemRew).toNumber()
    })
  })

  return elevationTotemRoundRewards
}

export const fetchLifetimeWinningsAndBonuses = async (account: string) => {
  const summitGlacierAddress = getSummitGlacierAddress()
  const res = await retryableMulticall(abi.summitGlacier, [{
      address: summitGlacierAddress,
      name: 'userLifetimeWinnings',
      params: [account]
  }, {
      address: summitGlacierAddress,
      name: 'userLifetimeBonusWinnings',
      params: [account]
  }], 'fetchUserInteractingEpochs')

  if (res == null) return {
    lifetimeSummitWinnings: BN_ZERO,
    lifetimeSummitBonuses: BN_ZERO,
  }

  return {
    lifetimeSummitWinnings: new BigNumber(res[0][0]._hex).toNumber(),
    lifetimeSummitBonuses: new BigNumber(res[1][0]._hex).toNumber(),
  }
}

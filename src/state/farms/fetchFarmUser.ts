import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils, FarmConfig, ForceElevationRetired } from 'config/constants/types'
import {
  getCartographerAddress,
  retryableMulticall,
  abi,
  groupByAndMap,
  getCartographerOasisAddress,
  getSubCartographerAddress,
} from 'utils'
import { farmId } from 'utils/farmId'

const getFarmTokens = (farms: FarmConfig[]) => {
  return [...new Set<string>(farms.map((farm) => farm.farmToken))]
}

export const fetchFarmUserAllowances = async (account: string, farmConfigs: FarmConfig[]) => {
  const farmTokens = getFarmTokens(farmConfigs)

  const calls = farmTokens.map((token) => ({
    address: token,
    name: 'allowance',
    params: [account, getCartographerAddress()],
  }))
  const tokenAllowancesRaw = await retryableMulticall(abi.ERC20, calls, 'fetchFarmUserAllowances')
  const tokenAllowances = groupByAndMap(
    farmTokens,
    (token) => token,
    (_, index) => new BigNumber(tokenAllowancesRaw == null ? 0 : tokenAllowancesRaw[index]),
  )

  return groupByAndMap(
    farmConfigs,
    (farm) => farmId(farm),
    (farm) => tokenAllowances[farm.farmToken],
  )
}

export const fetchFarmUserBalances = async (account, farmConfigs: FarmConfig[]) => {
  const farmTokens = getFarmTokens(farmConfigs)

  const calls = farmTokens.map((token) => ({
    address: token,
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await retryableMulticall(abi.ERC20, calls, 'fetchFarmUserBalance')

  const tokenBalances = groupByAndMap(
    farmTokens,
    (token) => token,
    (_, index) => new BigNumber(tokenBalancesRaw == null ? 0 : tokenBalancesRaw[index]),
  )

  return groupByAndMap(
    farmConfigs,
    (farm) => farmId(farm),
    (farm) => tokenBalances[farm.farmToken],
  )
}

export const fetchFarmUserStakedBalances = async (account: string, farmConfigs: FarmConfig[]) => {
    // TODO: check if this can handle everything being called with the same abi

  // const cartOasisAddress = await getCartographerOasisAddress()

  // const oasisIds = []
  // const elevationIds = []
  // const oasisCalls = []
  // const elevationCalls = []
  // farmConfigs.forEach((farm) => {
  //   if (farm.elevation === Elevation.OASIS) {
  //       oasisCalls.push({
  //       address: cartOasisAddress,
  //       name: 'userInfo',
  //       params: [farm.farmToken, account]
  //     })
  //   } else {
  //     elevationCalls.push({
  //       address: getSubCartographerAddress(farm.elevation),
  //       name: 'userInfo',
  //       params: [farm.farmToken, account]
  //     })
  //   }
  // })

  // const [oasisRes, elevationRes] = await Promise.all([
  //   await retryableMulticall(abi.cartographerOasis, oasisCalls, 'fetchFarmUserStakedBalances_cartOasis'),
  //   await retryableMulticall(abi.cartographerElevation, elevationCalls, 'fetchFarmUserStakedBalances_cartElev'),
  // ])

  // const ids = [...oasisIds, ...elevationIds]
  // const res = [...oasisRes, ...elevationRes]

  const calls = farmConfigs.map((farm) => ({
    address: getSubCartographerAddress(farm.elevation),
    name: 'userInfo',
    params: [farm.farmToken, account]
  }))
  const res = await retryableMulticall(abi.cartographerOasis, calls, 'fetchFarmUserStakedBalances')

  return groupByAndMap(
    farmConfigs,
    (farm) => farmId(farm),
    (_, index) => new BigNumber(res[index].staked._hex),
  )
}

export const fetchPoolClaimableRewards = async (account: string, farmConfigs: FarmConfig[]) => {
  const calls = farmConfigs.map((farm) => ({
    address: getSubCartographerAddress(farm.elevation),
    name: 'poolClaimableRewards',
    params: [farm.farmToken, account]
  }))

  const res = await retryableMulticall(abi.cartographerOasis, calls, 'fetchPoolClaimableRewards')
  
  return groupByAndMap(
    farmConfigs,
    (farm) => farmId(farm),
    (farm, index) => {
      if (res == null) return new BigNumber(0)
      return new BigNumber(res[index][0]._hex)
    }
  )
}

export const fetchPoolYieldContributed = async (account: string, farmConfigs: FarmConfig[]) => {
  const elevationFarms = farmConfigs.filter((farmConfig) => farmConfig.elevation !== Elevation.OASIS)

  const calls = elevationFarms.map((farm) => ({
    address: getSubCartographerAddress(farm.elevation),
    name: 'poolYieldContributed',
    params: [farm.farmToken, account]
  }))

  const res = await retryableMulticall(abi.cartographerElevation, calls, 'fetchPoolYieldContributed')
  
  return groupByAndMap(
    elevationFarms,
    (farm) => farmId(farm),
    (farm, index) => {
      if (res == null) return new BigNumber(0)
      return new BigNumber(res[index]._hex)
    }
  )
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
    (_, index) => res == null ? new BigNumber(0) : new BigNumber(res[index]._hex)
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
  const elevationFarms = farmConfigs.filter((farmConfig) => farmConfig.elevation !== Elevation.OASIS)

  const calls = elevationFarms.map((farm) => ({
    address: getSubCartographerAddress(farm.elevation),
    name: 'totemRoundRewards',
    params: [farm.farmToken],
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

  elevationFarms.forEach((farm, farmIndex) => {
    const [roundRewardsDirty, ...totemRoundRewardsDirty] = res[farmIndex][0]
    const roundRewards = new BigNumber(roundRewardsDirty ? roundRewardsDirty._hex : 0)
    const totemsRoundRewards = (totemRoundRewardsDirty || []).map((reward) => new BigNumber(reward._hex))

    elevationTotemRoundRewards[farm.elevation] = {
      roundRewards: (elevationTotemRoundRewards[farm.elevation].roundRewards).plus(roundRewards),
      totemRoundRewards: totemsRoundRewards.map((totemRewards, totemIndex) =>
        (elevationTotemRoundRewards[farm.elevation].totemRoundRewards[totemIndex] || new BigNumber(0))
          .plus(totemRewards),
      ),
    }
  })

  return elevationTotemRoundRewards
}

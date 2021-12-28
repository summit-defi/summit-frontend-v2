import BigNumber from 'bignumber.js'
import { Elevation, FarmConfig, ForceElevationRetired } from 'config/constants/types'
import {
  getCartographerAddress,
  retryableMulticall,
  abi,
  groupByAndMap,
  getCartographerOasisAddress,
  getCartographerElevationAddress,
} from 'utils'

const getFarmTokens = (farms: FarmConfig[]) => {
  return [...new Set<string>(farms.map((farm) => (farm.isTokenOnly ? farm.tokenAddress : farm.lpAddress)))]
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
    (farm) => farm.pid,
    (farm) => tokenAllowances[farm.isTokenOnly ? farm.tokenAddress : farm.lpAddress],
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
    (farm) => farm.pid,
    (farm) => tokenBalances[farm.isTokenOnly ? farm.tokenAddress : farm.lpAddress],
  )
}

export const fetchFarmUserStakedBalances = async (account: string, farmConfigs: FarmConfig[]) => {
  const { oasisPids, elevationPids } = farmConfigs.reduce(
    (accum, farm) => ({
      oasisPids: farm.elevation === Elevation.OASIS ? [...accum.oasisPids, farm.pid] : accum.oasisPids,
      elevationPids: farm.elevation !== Elevation.OASIS ? [...accum.elevationPids, farm.pid] : accum.elevationPids,
    }),
    { oasisPids: [], elevationPids: [] },
  )
  const oasisCalls = oasisPids.map((oasisPid) => {
    return {
      address: getCartographerOasisAddress(),
      name: 'userInfo',
      params: [oasisPid, account],
    }
  })

  const elevationCalls = elevationPids.map((elevationPid) => {
    return {
      address: getCartographerElevationAddress(),
      name: 'userInfo',
      params: [elevationPid, account],
    }
  })

  const [oasisRes, elevationRes] = await Promise.all([
    await retryableMulticall(abi.cartographerOasis, oasisCalls, 'fetchFarmUserStakedBalances_cartOasis'),
    await retryableMulticall(abi.cartographerElevation, elevationCalls, 'fetchFarmUserStakedBalances_cartElev'),
  ])

  const pids = [...oasisPids, ...elevationPids]
  const res = [...oasisRes, ...elevationRes]
  return groupByAndMap(
    pids,
    (pid) => pid,
    (_, index) => new BigNumber(res[index].staked._hex),
  )
}

export const fetchFarmEarnedAndVestingRewards = async (account: string, farmConfigs: FarmConfig[]) => {
  const { oasisPids, elevationPids } = farmConfigs.reduce(
    (accum, farm) => ({
      oasisPids: farm.elevation === Elevation.OASIS ? [...accum.oasisPids, farm.pid] : accum.oasisPids,
      elevationPids: farm.elevation !== Elevation.OASIS ? [...accum.elevationPids, farm.pid] : accum.elevationPids,
    }),
    { oasisPids: [], elevationPids: [] },
  )
  const oasisCalls = oasisPids.map((oasisPid) => ({
    address: getCartographerAddress(),
    name: 'rewards',
    params: [oasisPid, account],
  }))
  const elevationCalls = elevationPids.map((elevationPid) => ({
    address: getCartographerAddress(),
    name: 'rewards',
    params: [elevationPid, account],
  }))

  const oasisRes = await retryableMulticall(abi.cartographer, oasisCalls, 'fetchFarmUserEarnedAndVesting')
  const elevationRes = await retryableMulticall(abi.cartographer, elevationCalls, 'fetchFarmUserEarnedAndVesting')

  // Accumulate earned and vesting for each elevation
  return [...oasisPids, ...elevationPids].reduce(
    (acc, pid, farmIndex) => {
      if (farmIndex >= oasisPids.length) {
        return {
          ...acc,
          farmEarnedAndVesting: {
            ...acc.farmEarnedAndVesting,
            [pid]: {
              earned: new BigNumber(0),
              vesting: new BigNumber(0),
            },
          },
        }
      }
      const res = farmIndex >= oasisPids.length ? elevationRes[farmIndex - oasisPids.length] : oasisRes[farmIndex]
      const [earned, vesting] = res == null ? [new BigNumber(0), new BigNumber(0)] : [
        new BigNumber(res[0]._hex),
        new BigNumber(res[1]._hex)
      ]
      return {
        farmEarnedAndVesting: {
          ...acc.farmEarnedAndVesting,
          [pid]: {
            earned,
            vesting,
          },
        },
        elevationEarnedAndVesting: {
          ...acc.elevationEarnedAndVesting,
          [Elevation.OASIS]: {
            earned: (acc.elevationEarnedAndVesting[Elevation.OASIS]?.earned || new BigNumber(0)).plus(earned),
            vesting: (acc.elevationEarnedAndVesting[Elevation.OASIS]?.vesting || new BigNumber(0)).plus(vesting),
          },
        },
      }
    },
    { farmEarnedAndVesting: {}, elevationEarnedAndVesting: {
        [Elevation.PLAINS]: {
          earned: new BigNumber(0),
          vesting: new BigNumber(0),
        },
        [Elevation.MESA]: {
          earned: new BigNumber(0),
          vesting: new BigNumber(0),
        },
        [Elevation.SUMMIT]: {
          earned: new BigNumber(0),
          vesting: new BigNumber(0),
        },
      } 
    },
  )
}

export const fetchFarmRoundYieldContributed = async (account, farmConfigs: FarmConfig[]) => {
  const calls = farmConfigs.map((farmConfig) => ({
    address: getCartographerAddress(),
    name: 'hypotheticalRewards',
    params: [farmConfig.pid, account],
  }))

  const res = await retryableMulticall(abi.cartographer, calls, 'fetchFarmUserYieldContributed')

  return farmConfigs.reduce(
    (acc, farm, farmIndex) => {
      const yieldContributed = (farm.elevation !== Elevation.OASIS && ForceElevationRetired) || res == null ? new BigNumber(0) : new BigNumber(res[farmIndex][0]._hex)
      return {
        roundYieldContributed: {
          ...acc.roundYieldContributed,
          [farm.pid]: yieldContributed,
        },
        elevationRoundYieldContributed: {
          ...acc.elevationRoundYieldContributed,
          [farm.elevation]: (acc.elevationRoundYieldContributed[farm.elevation] || new BigNumber(0)).plus(
            yieldContributed,
          ),
        },
      }
    },
    { roundYieldContributed: {}, elevationRoundYieldContributed: {} },
  )
}

export const fetchElevationsRoundRewards = async (farmConfigs: FarmConfig[]) => {
  const elevationFarms = farmConfigs.filter((farmConfig) => farmConfig.elevation !== Elevation.OASIS)

  const calls = elevationFarms.map((farm) => ({
    address: getCartographerElevationAddress(),
    name: 'totemRoundRewards',
    params: [farm.pid],
  }))

  const res = await retryableMulticall(abi.cartographerElevation, calls, 'fetchElevationsRoundRewards')

  const elevationTotemRoundRewards = {
    [Elevation.OASIS]: {
      roundRewards: new BigNumber(0),
      totemsRoundRewards: [],
    },
  }

  elevationFarms.forEach((farm, farmIndex) => {
    const [roundRewardsDirty, ...totemRoundRewardsDirty] = res == null ? [...new Array(11)].fill(0) : res[farmIndex][0]
    const roundRewards = new BigNumber(roundRewardsDirty ? roundRewardsDirty._hex : 0)
    const totemsRoundRewards = (totemRoundRewardsDirty || []).map((reward) => new BigNumber(reward._hex))

    elevationTotemRoundRewards[farm.elevation] = {
      roundRewards: (elevationTotemRoundRewards[farm.elevation]?.roundRewards || new BigNumber(0)).plus(roundRewards),
      totemRoundRewards: totemsRoundRewards.map((totemRoundRewards, totemIndex) =>
        (elevationTotemRoundRewards[farm.elevation]?.totemRoundRewards[totemIndex] || new BigNumber(0)).plus(
          totemRoundRewards,
        ),
      ),
    }
  })

  return elevationTotemRoundRewards
}

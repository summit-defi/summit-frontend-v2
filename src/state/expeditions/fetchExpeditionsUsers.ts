import {
  retryableMulticall,
  abi,
  groupByAndMap,
  getCartographerAddress,
  getCartographerExpeditionAddress,
  getSummitLpAddress,
  getSummitTokenAddress,
} from 'utils/'
import BigNumber from 'bignumber.js'
import { ExpeditionConfig } from 'config/constants/types'

export const fetchExpeditionUserAllowanceAndBalance = async (account) => {
  const summitAddress = getSummitTokenAddress()
  const summitLpAddress = getSummitLpAddress()
  const cartographerAddress = getCartographerAddress()

  const res = await retryableMulticall(
    abi.BEP20,
    [
      {
        address: summitAddress,
        name: 'allowance',
        params: [account, cartographerAddress],
      },
      {
        address: summitAddress,
        name: 'balanceOf',
        params: [account],
      },
      {
        address: summitLpAddress,
        name: 'allowance',
        params: [account, cartographerAddress],
      },
      {
        address: summitLpAddress,
        name: 'balanceOf',
        params: [account],
      },
    ],
    'fetchExpeditionUserAllowanceAndBalance',
  )
  if (res == null) return null

  const [[summitAllowance], [summitBalance], [summitLpAllowance], [summitLpBalance]] = res

  return {
    summitAllowance: new BigNumber(summitAllowance._hex),
    summitBalance: new BigNumber(summitBalance._hex),
    summitLpAllowance: new BigNumber(summitLpAllowance._hex),
    summitLpBalance: new BigNumber(summitLpBalance._hex),
  }
}

export const fetchExpeditionStakedBalances = async (account, expeditionConfigs: ExpeditionConfig[]) => {
  const calls = expeditionConfigs.map((expedition) => ({
    address: getCartographerExpeditionAddress(),
    name: 'userInfo',
    params: [expedition.pid, account],
  }))
  const res = await retryableMulticall(abi.cartographerExpedition, calls, 'fetchExpeditionStakedBalances')
  if (res == null) return null
  return groupByAndMap(
    expeditionConfigs,
    (expedition) => expedition.pid,
    (_, index) => ({
      stakedSummit: new BigNumber(res[index].summitStaked._hex),
      stakedSummitLp: new BigNumber(res[index].lpStaked._hex),
    }),
  )
}

export const fetchExpeditionEarnedRewards = async (account, expeditionConfigs: ExpeditionConfig[]) => {
  const calls = expeditionConfigs.map((expedition) => ({
    address: getCartographerAddress(),
    name: 'rewards',
    params: [expedition.pid, account],
  }))

  const res = await retryableMulticall(abi.cartographer, calls, 'fetchExpeditionEarnedRewards')
  return groupByAndMap(
    expeditionConfigs,
    (expedition) => expedition.pid,
    (_, index) => new BigNumber(res != null ? res[index][0]._hex : 0),
  )
}

export const fetchExpeditionHypotheticalRewards = async (account, expeditionConfigs: ExpeditionConfig[]) => {
  const calls = expeditionConfigs.map((p) => ({
    address: getCartographerAddress(),
    name: 'hypotheticalRewards',
    params: [p.pid, account],
  }))
  const res = await retryableMulticall(abi.cartographer, calls, 'fetchExpeditionHypotheticalRewards')
  if (res == null) return null
  return groupByAndMap(
    expeditionConfigs,
    (expedition) => expedition.pid,
    (_, index) => ({
      effectiveStakedSummit: new BigNumber(res[index][0]._hex),
      hypotheticalWinReward: new BigNumber(res[index][1]._hex),
    }),
  )
}

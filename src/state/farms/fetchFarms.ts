import BigNumber from 'bignumber.js'
import {
  multicall,
  abi,
  groupBy,
  getCartographerAddress,
  getCartographerElevationAddress,
  getCartographerOasisAddress,
  retryDecorator,
} from 'utils/'
import { Elevation, elevationUtils, ForceElevationRetired } from '../../config/constants/types'
import { SECONDS_PER_YEAR } from 'config'
import { getFarmConfigs } from 'config/constants'
import { Farm } from 'state/types'

interface ExtendedFarm extends Farm {
  summitPerSecond: number
  elevEmissionMultiplier: BigNumber
}

export const fetchFarms = async () => {
  const farmConfigs = getFarmConfigs()
  const cartographerAddress = getCartographerAddress()
  const cartographerOasisAddress = getCartographerOasisAddress()
  const cartographerElevationAddress = getCartographerElevationAddress()

  const fetchFarmData = async (farmConfig): Promise<ExtendedFarm> => {
    const { tokenAddress, lpAddress, elevation } = farmConfig

    const isOasisFarm = elevation === Elevation.OASIS
    const subCartographerAddress = isOasisFarm ? cartographerOasisAddress : cartographerElevationAddress

    const [
      [allocation, elevEmissionMultiplier, stakedSupply, depositFee, earning, summitPerSecond],
      [poolInfo, [rawTotemSupplies]],
      [tokenDecimalsRaw],
    ] = await Promise.all([
      await multicall(abi.cartographer, [
        {
          address: cartographerAddress,
          name: 'elevationModulatedAllocation',
          params: [farmConfig.pid],
        },
        {
          address: cartographerAddress,
          name: 'tokenElevationEmissionMultiplier',
          params: [tokenAddress, elevationUtils.toInt(farmConfig.elevation)],
        },
        {
          address: cartographerAddress,
          name: 'stakedSupply',
          params: [farmConfig.pid],
        },
        {
          address: cartographerAddress,
          name: 'depositFee',
          params: [farmConfig.pid],
        },
        {
          address: cartographerAddress,
          name: 'isEarning',
          params: [farmConfig.pid],
        },
        {
          address: cartographerAddress,
          name: 'summitPerSecond',
        },
      ]),
      await multicall(isOasisFarm ? abi.cartographerOasis : abi.cartographerElevation, [
        {
          address: subCartographerAddress,
          name: isOasisFarm ? 'oasisPoolInfo' : 'elevationPoolInfo',
          params: [farmConfig.pid],
        },
        {
          address: subCartographerAddress,
          name: isOasisFarm ? 'depositFee' : 'totemSupplies', // Throwaway for oasis farm
          params: [farmConfig.pid],
        },
      ]),
      await multicall(abi.BEP20, [
        {
          address: tokenAddress,
          name: 'decimals',
        },
      ]),
    ])

    const tokenDecimals = new BigNumber(tokenDecimalsRaw).toNumber()
    const totemSupplies = [].concat(rawTotemSupplies)

    const totalFee = new BigNumber(depositFee)
    const trueDepositFee = totalFee.isGreaterThan(50) ? totalFee.minus(50) : new BigNumber(0)
    const withdrawalFee = totalFee.isGreaterThan(50) ? new BigNumber(50) : totalFee
    
    const trueAllocation = elevation !== Elevation.OASIS && ForceElevationRetired ?
      new BigNumber(0) :
      new BigNumber(allocation)

    const trueElevEmissionMultiplier = elevation !== Elevation.OASIS && ForceElevationRetired ?
      new BigNumber(0) :
      new BigNumber(elevEmissionMultiplier).div(new BigNumber(10).pow(12))

    return {
      ...farmConfig,
      tokenAddress,
      lpAddress,
      launched: elevation === Elevation.OASIS ? true : poolInfo.launched,
      live: poolInfo.live,
      earning,
      lpSupply: new BigNumber(stakedSupply),
      allocation: trueAllocation,
      elevEmissionMultiplier: trueElevEmissionMultiplier,
      depositFee: trueDepositFee,
      withdrawalFee,
      summitPerSecond: new BigNumber(summitPerSecond).div(new BigNumber(10).pow(18)).toNumber(),
      totemSupplies: (totemSupplies || []).map((staked) => new BigNumber(staked._hex)),
      tokenDecimals,
    }
  }

  const decoratedFetchFarmData = retryDecorator(fetchFarmData)

  const farmsData = (await Promise.all(farmConfigs.map(decoratedFetchFarmData))).filter((fetchFarmDataResult: any) => {
    if (fetchFarmDataResult.err) {
      console.error(`fetchFarms: ${fetchFarmDataResult.err}`)
      return false
    }
    return true
  }) as ExtendedFarm[]

  const { totalAlloc, symbolsAlloc } = farmsData.reduce(
    (acc, farm) => ({
      totalAlloc: acc.totalAlloc.plus(farm.allocation),
      symbolsAlloc: {
        ...acc.symbolsAlloc,
        [farm.symbol]: (acc.symbolsAlloc[farm.symbol] || new BigNumber(0)).plus(farm.allocation),
      },
    }),
    { totalAlloc: new BigNumber(0), symbolsAlloc: {} },
  )

  const farmsWithSummitPerYear = farmsData.map((farm) => {
    return {
      ...farm,
      summitPerYear: new BigNumber(farm.summitPerSecond)
        .times(SECONDS_PER_YEAR)
        .times(symbolsAlloc[farm.symbol])
        .div(totalAlloc)
        .times(farm.elevEmissionMultiplier),
    }
  })

  return groupBy(farmsWithSummitPerYear, (farm) => farm.pid)
}

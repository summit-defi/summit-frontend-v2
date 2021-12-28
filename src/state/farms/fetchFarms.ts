import BigNumber from 'bignumber.js'
import {
  multicall,
  abi,
  groupBy,
  getCartographerAddress,
  retryDecorator,
  getSubCartographerAddress,
} from 'utils/'
import { Elevation, elevationUtils, ForceElevationRetired } from '../../config/constants/types'
import { SECONDS_PER_YEAR } from 'config'
import { getFarmConfigs } from 'config/constants'
import { Farm } from 'state/types'
import { farmId } from 'utils/farmId'

interface ExtendedFarm extends Farm {
  summitPerSecond: number
  elevEmissionMultiplier: BigNumber
}

export const fetchFarms = async () => {
  const farmConfigs = getFarmConfigs()
  const cartographerAddress = getCartographerAddress()

  const fetchFarmData = async (farmConfig): Promise<ExtendedFarm> => {
    const { tokenAddress, lpAddress, elevation } = farmConfig

    const elevationInt = elevationUtils.toInt(farmConfig.elevation)
    const isOasisFarm = elevation === Elevation.OASIS
    const subCartographerAddress = getSubCartographerAddress(elevation)

    const [
      [allocation, elevEmissionMultiplier, tokenDepositFee, tokenWithdrawalTax, earning, summitPerSecond],
      [poolInfo, [rawTotemSupplies]],
    ] = await Promise.all([
      await multicall(abi.cartographer, [
        {
          address: cartographerAddress,
          name: 'elevationModulatedAllocation',
          params: [tokenAddress, elevationInt],
        },
        {
          address: cartographerAddress,
          name: 'tokenElevationEmissionMultiplier',
          params: [tokenAddress, elevationInt],
        },
        {
          address: cartographerAddress,
          name: 'tokenDepositFee',
          params: [tokenAddress, elevationInt],
        },
        {
          address: cartographerAddress,
          name: 'tokenWithdrawalTax',
          params: [tokenAddress, elevationInt],
        },
        {
          address: cartographerAddress,
          name: 'tokenElevationIsEarning',
          params: [tokenAddress, elevationInt],
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
          params: [tokenAddress],
        },
        {
          address: subCartographerAddress,
          name: isOasisFarm ? 'depositFee' : 'totemSupplies', // Throwaway for oasis farm
          params: [tokenAddress],
        },
      ]),
    ])

    const totemSupplies = [].concat(rawTotemSupplies)

    const totalFee = new BigNumber(tokenDepositFee)
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
      supply: new BigNumber(poolInfo.supply),
      allocation: trueAllocation,
      elevEmissionMultiplier: trueElevEmissionMultiplier,
      depositFeeBP: trueDepositFee,
      taxBP: withdrawalFee,
      summitPerSecond: new BigNumber(summitPerSecond).div(new BigNumber(10).pow(18)).toNumber(),
      totemSupplies: (totemSupplies || []).map((staked) => new BigNumber(staked._hex)),
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

  return groupBy(farmsWithSummitPerYear, (farm) => farmId(farm))
}

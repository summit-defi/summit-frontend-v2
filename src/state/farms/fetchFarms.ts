import BigNumber from 'bignumber.js'
import {
  multicall,
  abi,
  groupBy,
  getCartographerAddress,
  retryDecorator,
  getSubCartographerAddress,
} from 'utils/'
import { Elevation, elevationUtils } from '../../config/constants/types'
import { SECONDS_PER_YEAR } from 'config'
import { getFarmConfigs } from 'config/constants'
import { Farm } from 'state/types'
import { farmId } from 'utils/farmId'


export const fetchFarms = async () => {
  const farmConfigs = getFarmConfigs()
  const cartographerAddress = getCartographerAddress()

  const fetchFarmData = async (farmConfig): Promise<Farm> => {
    const { farmToken, elevation } = farmConfig

    const elevationInt = elevationUtils.toInt(farmConfig.elevation)
    const isOasisFarm = elevation === Elevation.OASIS
    const subCartographerAddress = getSubCartographerAddress(elevation)

    const [
      [allocEmissionMultiplier, elevEmissionMultiplier, tokenDepositFee, tokenWithdrawalTax, summitPerSecond],
      [poolInfo, [rawTotemSupplies]],
    ] = await Promise.all([
      await multicall(abi.cartographer, [
        {
          address: cartographerAddress,
          name: 'tokenAllocEmissionMultiplier',
          params: [farmToken, elevationInt],
        },
        {
          address: cartographerAddress,
          name: 'tokenElevationEmissionMultiplier',
          params: [farmToken, elevationInt],
        },
        {
          address: cartographerAddress,
          name: 'tokenDepositFee',
          params: [farmToken],
        },
        {
          address: cartographerAddress,
          name: 'tokenWithdrawalTax',
          params: [farmToken],
        },
        {
          address: cartographerAddress,
          name: 'summitPerSecond',
        },
      ]),
      await multicall(isOasisFarm ? abi.cartographerOasis : abi.cartographerElevation, [
        {
          address: subCartographerAddress,
          name: 'poolInfo',
          params: [farmToken],
        },
        {
          address: subCartographerAddress,
          name: isOasisFarm ? 'supply' : 'totemSupplies', // Throwaway for oasis farm
          params: [farmToken],
        },
      ]),
    ])

    const totemSupplies = [].concat(rawTotemSupplies)

    const summitPerYear = new BigNumber(summitPerSecond)
      .times(SECONDS_PER_YEAR)
      .times(new BigNumber(elevEmissionMultiplier))
      .times(new BigNumber(allocEmissionMultiplier))
      .div(new BigNumber(10).pow(24))

    return {
      ...farmConfig,
      launched: elevation === Elevation.OASIS ? true : poolInfo.launched,
      live: poolInfo.live,
      supply: new BigNumber(poolInfo.supply),
      depositFeeBP: new BigNumber(tokenDepositFee),
      taxBP: new BigNumber(tokenWithdrawalTax),
      totemSupplies: (totemSupplies || []).map((staked) => new BigNumber(staked._hex)),
      summitPerYear,
    }
  }

  const decoratedFetchFarmData = retryDecorator(fetchFarmData)

  const farmsData = (await Promise.all(farmConfigs.map(decoratedFetchFarmData))).filter((fetchFarmDataResult: any) => {
    if (fetchFarmDataResult.err) {
      console.error(`fetchFarms: ${fetchFarmDataResult.err}`)
      return false
    }
    return true
  }) as Farm[]

  return groupBy(farmsData, (farm) => farmId(farm))
}

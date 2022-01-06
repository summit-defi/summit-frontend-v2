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
import { merge } from 'lodash'


export const fetchFarms = async () => {
  const farmConfigs = getFarmConfigs()
  const cartographerAddress = getCartographerAddress()

  const fetchFarmData = async (farmConfig): Promise<Farm> => {
    const { farmToken } = farmConfig

    /*
      TOKEN
        . alloc emission mult
        . elev emission mult
        . deposit fee
        . fairness tax
        . summit per second
      OASIS
        . pool info (live & supply)
      ELEVATIONS
        . pool info (live & launched & supply)
    */

    const [
      [allocEmissionMultiplier, elevEmissionMultiplier, tokenDepositFee, tokenWithdrawalTax, summitPerSecond],
      [oasisPoolInfo],
      [plainsPoolInfo],
      [mesaPoolInfo],
      [summitPoolInfo],
    ] = await Promise.all([
      await multicall(abi.cartographer, [
        {
          address: cartographerAddress,
          name: 'tokenAllocEmissionMultiplier',
          params: [farmToken],
        },
        {
          address: cartographerAddress,
          name: 'tokenElevationEmissionMultiplier',
          params: [farmToken, 0],
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
      ...elevationUtils.all.map(async (elev) => multicall(
        elev === Elevation.OASIS ? abi.cartographerOasis : abi.cartographerElevation, [{
          address: getSubCartographerAddress(elev),
          name: 'poolInfo',
          params: [farmToken],
      }])),
    ])

    const summitPerYear = new BigNumber(summitPerSecond)
      .times(SECONDS_PER_YEAR)
      .times(new BigNumber(elevEmissionMultiplier))
      .times(new BigNumber(allocEmissionMultiplier))
      .div(new BigNumber(10).pow(24))

    

    const elevationsInfo = {
      [Elevation.OASIS]: {
        live: oasisPoolInfo.live,
        supply: new BigNumber(oasisPoolInfo.supply._hex),
      },
      [Elevation.PLAINS]: {
        live: plainsPoolInfo.live,
        launched: plainsPoolInfo.launched,
        supply: new BigNumber(plainsPoolInfo.supply._hex),
      },
      [Elevation.MESA]: {
        live: mesaPoolInfo.live,
        launched: mesaPoolInfo.launched,
        supply: new BigNumber(mesaPoolInfo.supply._hex),
      },
      [Elevation.SUMMIT]: {
        live: summitPoolInfo.live,
        launched: summitPoolInfo.launched,
        supply: new BigNumber(summitPoolInfo.supply._hex),
      }
    }

    return {
      ...farmConfig,
      elevations: merge({}, farmConfig.elevations, elevationsInfo),
      depositFeeBP: new BigNumber(tokenDepositFee),
      taxBP: new BigNumber(tokenWithdrawalTax),
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

  return groupBy(farmsData, (farm) => farm.symbol)
}

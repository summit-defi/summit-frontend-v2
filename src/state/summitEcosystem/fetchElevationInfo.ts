import {
  getElevationHelperAddress,
  retryableMulticall,
  abi,
  groupByAndMap,
  getSubCartographerAddress,
} from 'utils/'
import BigNumber from 'bignumber.js'
import { Elevation, ElevationRoundOffset, elevationUtils, ElevationWinnersOffset } from 'config/constants/types'

export const fetchElevationsData = async () => {
  const elevationHelperAddress = getElevationHelperAddress()
  const calls = elevationUtils.elevationExpedition.map((elevation) => [
    {
      address: elevationHelperAddress,
      name: 'unlockTimestamp',
      params: [elevationUtils.toInt(elevation)],
    },
    {
      address: elevationHelperAddress,
      name: 'roundEndTimestamp',
      params: [elevationUtils.toInt(elevation)],
    },
    {
      address: elevationHelperAddress,
      name: 'historicalWinningTotems',
      params: [elevationUtils.toInt(elevation)],
    },
    {
      address: elevationHelperAddress,
      name: 'roundNumber',
      params: [elevationUtils.toInt(elevation)],
    },
  ])

  const res = await retryableMulticall(abi.elevationHelper, calls.flat(), 'fetchElevationsData_elevHelper')
  if (res == null) return null

  const prevWinningsMultipliersCalls = elevationUtils.elevationOnly.map((elevation, elevIndex) => {
    const roundNumber = new BigNumber(res[elevIndex * 4 + 3][0]._hex).toNumber()
    return [1, 2, 3, 4, 5, 6].map((roundOffset) => ({
      address: getSubCartographerAddress(elevation),
      name: 'elevRoundWinningsMult',
      params: [elevationUtils.toInt(elevation), Math.max(0, roundNumber - roundOffset)],
    }))
  })

  const prevWinningsMultipliersRes = await retryableMulticall(
    abi.cartographerElevation,
    prevWinningsMultipliersCalls.flat(),
    'fetchElevationsData_cartElev',
  )
  if (prevWinningsMultipliersRes == null) return null

  return groupByAndMap(
    elevationUtils.elevationExpedition,
    (elevation) => elevation,
    (elevation, index) => {
      let unlockTimestamp = new BigNumber(res[index * 4 + 0]).toNumber()

      // Artificially increase unlock timestamp of MESA and SUMMIT
      if (elevation === Elevation.MESA) unlockTimestamp += (2 * 86400 + 8 * 3600)
      if (elevation === Elevation.SUMMIT) unlockTimestamp += 1 * 86400
      if (elevation === Elevation.EXPEDITION) unlockTimestamp += 4 * 86400

      const roundEndTimestamp = new BigNumber(res[index * 4 + 1]).toNumber()
      const historicInfo = res[index * 4 + 2][0].map((item) => new BigNumber(item._hex).toNumber())
      const roundNumber = new BigNumber(res[index * 4 + 3][0]._hex).toNumber() - ElevationRoundOffset[elevation]

      let prevWinningsMultipliers = []
      if (elevation !== Elevation.EXPEDITION) {
        prevWinningsMultipliers = prevWinningsMultipliersRes
          .slice(index * 6, index * 6 + 6)
          .map((item) => new BigNumber(item).dividedBy(new BigNumber(10).pow(12)).toNumber())
      }
      return {
        unlockTimestamp,
        roundEndTimestamp,
        roundNumber,
        totemWinAcc: historicInfo.slice(0, 10).map((wins, i) => wins - ElevationWinnersOffset[elevation][i]),
        prevWinners: historicInfo.slice(10, 10 + roundNumber - 1),
        prevWinningsMultipliers,
      }
    },
  )
}

export const fetchElevationHelperPublicInfo = async () => {
  const elevationHelperAddress = getElevationHelperAddress()
  const calls = [
    {
      address: elevationHelperAddress,
      name: 'referralBurnTimestamp',
    },
    {
      address: elevationHelperAddress,
      name: 'currentDeityDivider',
    },
  ]

  const res = await retryableMulticall(abi.elevationHelper, calls, 'fetchElevationHelperPublicInfo')
  if (res == null) return null
  const [referralBurnTimestamp, expeditionDivider] = res

  return {
    referralBurnTimestamp: new BigNumber(referralBurnTimestamp).toNumber(),
    expeditionDivider: new BigNumber(expeditionDivider).toNumber(),
  }
}

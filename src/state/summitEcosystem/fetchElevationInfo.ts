import {
  getElevationHelperAddress,
  retryableMulticall,
  abi,
  groupByAndMap,
} from 'utils/'
import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'

export const fetchElevationsData = async (elevation?: Elevation) => {
  const elevationHelperAddress = getElevationHelperAddress()
  const elevations = elevation != null ? [elevation] : elevationUtils.elevationExpedition
  const calls = elevations.map((elev) => [
    {
      address: elevationHelperAddress,
      name: 'unlockTimestamp',
      params: [elevationUtils.toInt(elev)],
    },
    {
      address: elevationHelperAddress,
      name: 'roundEndTimestamp',
      params: [elevationUtils.toInt(elev)],
    },
    {
      address: elevationHelperAddress,
      name: 'historicalWinningTotems',
      params: [elevationUtils.toInt(elev)],
    },
    {
      address: elevationHelperAddress,
      name: 'roundNumber',
      params: [elevationUtils.toInt(elev)],
    }
  ])

  const res = await retryableMulticall(abi.elevationHelper, calls.flat(), 'fetchElevationsData_elevHelper')
  if (res == null) return null

  // TODO: Re-enable this with next version of testnet deployment
  // const prevWinningsMultipliersCalls = elevationUtils.elevationOnly.map((elevation, elevIndex) => {
  //   const roundNumber = new BigNumber(res[elevIndex * 4 + 3][0]._hex).toNumber()
  //   return [1, 2, 3, 4, 5, 6].map((roundOffset) => ({
  //     address: getSubCartographerAddress(elevation),
  //     name: 'roundWinningsMult',
  //     params: [elevationUtils.toInt(elevation), Math.max(0, roundNumber - roundOffset)],
  //   }))
  // })

  // const prevWinningsMultipliersRes = await retryableMulticall(
  //   abi.cartographerElevation,
  //   prevWinningsMultipliersCalls.flat(),
  //   'fetchElevationsData_cartElev',
  // )
  // if (prevWinningsMultipliersRes == null) return null

  return groupByAndMap(
    elevations,
    (elev) => elev,
    (elev, index) => {
      const unlockTimestamp = new BigNumber(res[index * 4 + 0]).toNumber()

      // Artificially increase unlock timestamp of MESA and SUMMIT
      // if (elevation === Elevation.MESA) unlockTimestamp += (2 * 86400 + 8 * 3600)
      // if (elevation === Elevation.SUMMIT) unlockTimestamp += 1 * 86400
      // if (elevation === Elevation.EXPEDITION) unlockTimestamp += 4 * 86400

      const roundEndTimestamp = new BigNumber(res[index * 4 + 1]).toNumber()
      const totemWinAcc = res[index * 4 + 2][0].map((item) => new BigNumber(item._hex).toNumber())
      const prevWinners = res[index * 4 + 2][1].map((item) => new BigNumber(item._hex).toNumber())
      const roundNumber = new BigNumber(res[index * 4 + 3][0]._hex).toNumber()

      let prevWinningsMultipliers = []
      if (elev !== Elevation.EXPEDITION) {
        prevWinningsMultipliers = [1.1, 1.2, 1.3, 1.4, 1.5, 1.6]
        /// TODO: Re-enable with next testnet deployment
        // prevWinningsMultipliers = prevWinningsMultipliersRes
        //   .slice(index * 6, index * 6 + 6)
        //   .map((item) => new BigNumber(item).dividedBy(new BigNumber(10).pow(12)).toNumber())
      }

      const winningTotem = elev === Elevation.OASIS ?
        0 :
        (roundNumber <= 1 || prevWinners.length === 0) ? null : prevWinners[0]
      return {
        unlockTimestamp,
        roundEndTimestamp,
        roundNumber,
        totemWinAcc,
        prevWinners,
        prevWinningsMultipliers,
        winningTotem,
      }
    },
  )
}

export const fetchDeityDivider = async () => {
  const elevationHelperAddress = getElevationHelperAddress()
  const calls = [
    {
      address: elevationHelperAddress,
      name: 'currentDeityDivider',
    },
  ]

  const res = await retryableMulticall(abi.elevationHelper, calls, 'fetchElevationHelperPublicInfo')
  if (res == null) return null
  const [expeditionDivider] = res
  return new BigNumber(expeditionDivider).toNumber()
}

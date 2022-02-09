import {
  getElevationHelperAddress,
  retryableMulticall,
  abi,
  groupByAndMap,
  getSubCartographerAddress,
} from 'utils/'
import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'
import { range } from 'lodash'

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

  const prevWinningsMultipliersCalls = []
  const elevRounds = []
  
  elevations.forEach((elev, elevIndex) => {
    if (elev === Elevation.EXPEDITION) return

    const maxRoundNumber = Math.max(new BigNumber(res[elevIndex * 4 + 3][0]._hex).toNumber() - 1, 0)
    const minRoundNumber = Math.max(maxRoundNumber - 5, 1)
    const rounds = range(maxRoundNumber, minRoundNumber - 1, -1);
    elevRounds.push(rounds)
    rounds.forEach((round) => prevWinningsMultipliersCalls.push({
      address: getSubCartographerAddress(elev),
      name: 'roundWinningsMult',
      params: [round],
    }))
  })

  const prevWinningsMultipliersRes = await retryableMulticall(
    abi.cartographerElevation,
    prevWinningsMultipliersCalls,
    'fetchElevationsData_cartElev',
  )

  const elevPrevWinningsMultipliers = []
  let cumRoundsCount = 0
  elevations.forEach((elev, index) => {
    if (elev === Elevation.EXPEDITION) return

    const rounds = elevRounds[index]
    const roundsCount = rounds.length
    if (prevWinningsMultipliersRes == null) {
      elevPrevWinningsMultipliers.push(rounds.map(() => elevationUtils.totemCount(elev)))
    } else {
      elevPrevWinningsMultipliers.push(
        prevWinningsMultipliersRes
          .slice(cumRoundsCount, cumRoundsCount + roundsCount)
          .map((mult) => new BigNumber(mult[0]._hex).dividedBy(new BigNumber(10).pow(12)).toNumber())
        )
    }
    cumRoundsCount += roundsCount
  })

  return groupByAndMap(
    elevations,
    (elev) => elev,
    (elev, index) => {
      const unlockTimestamp = new BigNumber(res[index * 4 + 0]).toNumber()

      const roundEndTimestamp = new BigNumber(res[index * 4 + 1]).toNumber()
      const roundNumber = new BigNumber(res[index * 4 + 3][0]._hex).toNumber()

      // TODO: Remove clipping for mainnet launch
      const clipPrevWinners = roundNumber <= 10
      const totemWinAcc = res[index * 4 + 2][0].map((item) => new BigNumber(item._hex).toNumber())
      const prevWinners = res[index * 4 + 2][1].map((item) => new BigNumber(item._hex).toNumber()).slice(0, clipPrevWinners ? -1 : undefined)

      let prevWinningsMultipliers = []
      if (elev !== Elevation.EXPEDITION) {
        prevWinningsMultipliers = elevPrevWinningsMultipliers[index]
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

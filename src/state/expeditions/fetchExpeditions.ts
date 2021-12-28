import { getExpeditionConfigs } from 'config/constants/expeditions'
import { multicall, abi, getElevationHelperAddress, getExpeditionAddress, groupByAndMap } from 'utils'
import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'

export const fetchExpeditions = async () => {
  const expeditions = getExpeditionConfigs()
  const cartographerExpeditionAddress = getExpeditionAddress()
  const elevationHelperAddress = getElevationHelperAddress()
  const callsExpeditionsInfo = expeditions.map((expeditionConfig) => [
    {
      address: cartographerExpeditionAddress,
      name: 'expeditionPoolInfo',
      params: [expeditionConfig.pid],
    },
    {
      address: cartographerExpeditionAddress,
      name: 'totemSupplies',
      params: [expeditionConfig.pid],
    },
    {
      address: cartographerExpeditionAddress,
      name: 'remainingRewards',
      params: [expeditionConfig.pid],
    },
  ])

  const [expeditionsRes, [expeditionRoundRaw]] = await Promise.all([
    await multicall(abi.cartographerExpedition, callsExpeditionsInfo.flat()),
    await multicall(abi.elevationHelper, [
      {
        address: elevationHelperAddress,
        name: 'roundNumber',
        params: [elevationUtils.toInt(Elevation.EXPEDITION)],
      },
    ]),
  ])

  const expeditionRound = new BigNumber(expeditionRoundRaw)

  return groupByAndMap(
    expeditions,
    (expeditionConfig) => expeditionConfig.pid,
    (expeditionConfig, expeditionIndex) => {
      const expeditionInfo = expeditionsRes[expeditionIndex * 3 + 0]

      const startRound = new BigNumber(expeditionInfo.startRound._hex)
      const totalRounds = new BigNumber(expeditionInfo.totalRoundsCount._hex)
      const endRound = startRound.plus(totalRounds)
      const roundsRemaining = endRound.minus(startRound.isGreaterThan(expeditionRound) ? startRound : expeditionRound)

      const totemsDeposited = expeditionsRes[expeditionIndex * 3 + 1][0].map((staked) => new BigNumber(staked._hex))
      const totalDeposited = totemsDeposited[0].plus(totemsDeposited[1])

      const roundEmission = new BigNumber(expeditionInfo.roundEmission._hex)
      const roundEmissionDecFixed = roundEmission.div(new BigNumber(10).pow(expeditionConfig.rewardToken.decimals))
      const bullSupply = totemsDeposited[0].div(new BigNumber(10).pow(18))
      const bearSupply = totemsDeposited[1].div(new BigNumber(10).pow(18))
      const bullWinMultiplier = roundEmissionDecFixed.div(bullSupply)
      const bearWinMultiplier = roundEmissionDecFixed.div(bearSupply)

      return {
        ...expeditionConfig,
        live: expeditionInfo.live,
        launched: expeditionInfo.launched,
        totalSummitStaked: new BigNumber(expeditionInfo.summitSupply._hex),
        totalSummitLpStaked: new BigNumber(expeditionInfo.lpSupply._hex),
        expeditionRound: expeditionRound.toNumber(),
        startRound: startRound.toNumber(),
        totalRounds: totalRounds.toNumber(),
        roundsRemaining: roundsRemaining.toNumber(),
        totalEmission: new BigNumber(expeditionInfo.totalRewardAmount._hex),
        roundEmission,
        rewardsRemaining: new BigNumber(expeditionsRes[expeditionIndex * 3 + 2]),
        totalDeposited,
        totemsDeposited,
        totemWinMultipliers: [bullWinMultiplier, bearWinMultiplier],
      }
    },
  )
}

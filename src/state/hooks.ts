import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { getWeb3NoAccount, getTimestampDiff, groupByAndMap, groupBy, getFormattedBigNumber, epochEndTimestamp, epochThawTimestamp } from 'utils'
import {
  fetchFarmsPublicDataAsync,
  fetchExpeditionUserDataAsync,
  fetchExpeditionPublicDataAsync,
} from './actions'
import { State, Farm, ExpeditionInfo, ElevationInfo, ExpeditionUserData, UserTokenData, EverestUserData, EverestState } from './types'
import { BN_ZERO, Elevation, ElevationFarmTab, ElevationUnlockRound, elevationUtils, FarmConfig, ForceElevationRetired, RoundLockTime, SummitPalette } from '../config/constants/types'
import { fetchPricesAsync } from './prices'
import {
  fetchElevationHelperInfoAsync,
  fetchElevationsPublicDataAsync,
  fetchSummitEcosystemEnabledAsync,
} from './summitEcosystem'
import { useLocation } from 'react-router-dom'
import { getFarmConfigs } from 'config/constants/farms'
import useTheme from 'hooks/useTheme'
import { getChainWrappedNativeTokenSymbol, TokenSymbol } from 'config/constants'
import { fetchExpeditionPotentialWinnings, fetchExpeditionWinnings } from './expedition/fetchExpeditionUserInfo'
import { updateExpeditionUserPotentialWinningsAsync, updateExpeditionUserWinnings, updateExpeditionUserWinningsAsync } from './expedition'
import { createSelector } from '@reduxjs/toolkit'
import { useWallet } from '@binance-chain/bsc-use-wallet'

const ZERO = new BigNumber(0)

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => {
      setMatches(media.matches)
    }
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

export const useChainId = () => {
  return useSelector((state: State) => state.summitEcosystem.chainId)
}
export const useFarmConfigs = () => {
  const chainId = useChainId()
  const [farmConfigs, setFarmConfigs] = useState<FarmConfig[]>(getFarmConfigs())
  useEffect(() => {
    setFarmConfigs(getFarmConfigs())
  }, [chainId, setFarmConfigs])
  return farmConfigs
}

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchExpeditionPublicDataAsync())
    dispatch(fetchElevationsPublicDataAsync())
    dispatch(fetchElevationHelperInfoAsync())
  }, [dispatch, slowRefresh])
}
export const useCurrentTimestamp = (): number => {
  const [timestamp, setTimestamp] = useState<number>(Math.floor(Date.now() / 1000))
  useEffect(() => {
    setTimestamp(Math.floor(Date.now() / 1000))
    const interval = setInterval(() => {
      setTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return timestamp
}

export const useCurrentTimestampOnce = (): number => {
  const [timestamp, setTimestamp] = useState<number>(Math.floor(Date.now() / 1000))
  useEffect(() => {
    setTimestamp(Math.floor(Date.now() / 1000))
  }, [])
  return timestamp
}

// Farms

export const useFarms = (): Farm[] => {
  const selectorFarms = useSelector((state: State) => state.farms.data)
  return selectorFarms
}
export const useFarmsLoaded = (): boolean => {
  return useSelector((state: State) => state.farms.farmsLoaded)
}

export const useElevationUserRoundInfo = (elevation: Elevation) => {
  return useSelector((state: State) => elevation === Elevation.EXPEDITION ? {} : state.farms.elevationData[elevationUtils.toInt(elevation || Elevation.OASIS)])
}
export const useDashboardTotemBattleInfo = () => {
  const elevationData = useSelector((state: State) => state.farms.elevationData) 
  const userTotems = useSelector((state: State) => state.summitEcosystem.totems)
  return useMemo(
    () => elevationUtils.elevationOnly
      .map((elev) => {
        const userTotem = userTotems[elevationUtils.toInt(elev)]
        if (userTotem == null) return []
        return [{
          totem: userTotem,
          mult: elevationData[elevationUtils.toInt(elev)]?.totemMultipliers[userTotem] || 0
        }]
      }),
    [elevationData, userTotems]
  )
}

export const useMultiElevYieldInfo = () => {
  const elevationData = useSelector((state: State) => state.farms.elevationData) 
  return useMemo(
    () => {
      const elevYieldsRaw = elevationUtils.elevationOnly
        .map((elev) => {
          const { yieldContributed, potentialWinnings } = elevationData[elevationUtils.toInt(elev)] || { yieldContributed: BN_ZERO, potentialWinnings: BN_ZERO }
          return {
            elev,
            yieldContributed,
            potentialWinnings,
          }
        })
        .filter((rawYield) => rawYield.yieldContributed.plus(rawYield.potentialWinnings).isGreaterThan(0))

      const { totalYieldContributed, totalPotentialWinnings } = elevYieldsRaw.reduce((acc, elevYield) => ({
        totalYieldContributed: acc.totalYieldContributed.plus(elevYield.yieldContributed),
        totalPotentialWinnings: acc.totalPotentialWinnings.plus(elevYield.potentialWinnings),
      }), { totalYieldContributed: BN_ZERO, totalPotentialWinnings: BN_ZERO})

      const elevYieldsBreakdown = elevYieldsRaw.map((rawYield, index) => ({
        title: rawYield.elev,
        elevation: true,
        key: elevationUtils.toInt(rawYield.elev),
        perc: elevYieldsRaw[index].yieldContributed.times(100).div(totalYieldContributed).toNumber(),
        val: `${getFormattedBigNumber(elevYieldsRaw[index].yieldContributed)} SUMMIT`,
      }))

      return {
        elevYieldsBreakdown,
        totalYieldContributed,
        totalPotentialWinnings
      }
    },
    [elevationData]
  )
}

export const useAllElevationsClaimable = () => {
  const elevationData = useSelector((state: State) => state.farms.elevationData) 
  return useMemo(
    () => {
      const elevationsClaimable = elevationUtils.all
        .map((elevation) => ({
          elevation,
          claimable: (elevationData[elevationUtils.toInt(elevation)]?.claimable || BN_ZERO) as BigNumber
        }))
        .filter((rawClaimable) => rawClaimable.claimable.isGreaterThan(0))

      const totalClaimable = elevationsClaimable
        .reduce((acc, elevClaimable) => acc.plus(elevClaimable.claimable), BN_ZERO)

      const claimableBreakdown = elevationsClaimable.map((rawClaimable, index) => ({
        title: rawClaimable.elevation,
        elevation: true,
        key: elevationUtils.toInt(rawClaimable.elevation),
        perc: elevationsClaimable[index].claimable.times(100).div(totalClaimable).toNumber(),
        val: `${getFormattedBigNumber(elevationsClaimable[index].claimable)} SUMMIT`,
      }))

      return {
        elevationsClaimable,
        totalClaimable,
        claimableBreakdown,
      }
    },
    [elevationData]
  )
}

export const useMultiElevStaked = () => {
  const { totalTVL, elevTVL } = useUserTVLs()
  return useMemo(
    () => {
      const tvlContributions = Object.entries(elevTVL)
        .filter(([elevation, tvl]) => tvl.isGreaterThan(0))
        .map(([elevation, tvl]) => ({
          title: elevation,
          elevation: true,
          key: elevationUtils.toInt(elevation as Elevation),
          perc: tvl.times(100).div(totalTVL).toNumber(),
          val: `$${tvl.toFixed(2)} (${tvl.times(100).div(totalTVL).toFixed(1)}%)`,
        }))

      return {
        totalTVL,
        tvlContributions,
      }
    },
    [totalTVL, elevTVL]
  )
}



export const useElevationsStaked = () => {
  const oasisStaked = useSelector((state: State) => state.farms.elevationData[0])
}

// User Tokens Data
export const useUserTokens = () => {
  const selectorTokens: UserTokenData[] = useSelector((state: State) => state.tokens.data)
  return useMemo(
    () => groupBy(
      selectorTokens,
      (token) => token.symbol,
    ),
    [selectorTokens]
  )
}

// Expeditions

export const useExpeditionFetching = () => {
  const { account } = useWallet()
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchExpeditionPublicDataAsync())
      dispatch(fetchExpeditionUserDataAsync(account))
      dispatch(updateExpeditionUserWinningsAsync(account))
      dispatch(updateExpeditionUserPotentialWinningsAsync(account))
    }
  }, [account, dispatch, slowRefresh])
}

export const useExpeditionInfo = () => useSelector((state: State) => state.expedition.data)
export const useExpeditionUserData = () => useSelector((state: State) => state.expedition.userData)

export const useExpeditionEntered = () => {
  const { entered } = useExpeditionUserData()
  return useMemo(
    () => entered,
    [entered],
  )
}
export const useExpeditionEntryFlow = (): {
  deity: number | null,
  conviction: number | null,
  everestOwned: BigNumber
} => {
  const userData = useExpeditionUserData()
  console.log({
    userData
  })
  const { deity, conviction, everestOwned } = useExpeditionUserData()
  return useMemo(
    () => ({
      deity,
      conviction,
      everestOwned,
    }),
    [deity, conviction, everestOwned]
  )
}

export const useExpeditionTotemHeaderInfo = () => {
  const { deity, conviction } = useExpeditionUserData()
  const { deitiedEverest, deityEverest } = useExpeditionInfo()
  return useMemo(
    () => ({
      deity,
      conviction,
      deitiedEverest,
      deityEverest,
    }),
    [deity, deitiedEverest, deityEverest, conviction]
  )
}


export const useExpeditionLoaded = () => {
  const expeditionLoaded: ExpeditionInfo = useSelector((state: State) => state.expedition.expeditionLoaded)
  const userDataLoaded = useSelector((state: State) => state.expedition.userDataLoaded)
  return {
    expeditionLoaded,
    userDataLoaded,
  }
}

// Prices
export const usePricesPerToken = () => {
  return useSelector((state: State) => state.prices.pricesPerToken)
}
export const useNativeTokenPrice = (): BigNumber => {
  const pricesPerToken = usePricesPerToken()
  return useMemo(
    () => {
      const wrappedNativeTokenSymbol = getChainWrappedNativeTokenSymbol()
      if (pricesPerToken == null || pricesPerToken[wrappedNativeTokenSymbol]) return new BigNumber(2.5)
      return pricesPerToken[wrappedNativeTokenSymbol]
    },
    [pricesPerToken]
  )
}

export const useSummitPrice = (): BigNumber => {
  const pricesPerToken = usePricesPerToken()
  return useMemo(
    () => {
      if (pricesPerToken == null || pricesPerToken[TokenSymbol.SUMMIT] == null) return new BigNumber(1)
      return pricesPerToken[TokenSymbol.SUMMIT]
    },
    [pricesPerToken]
  )
}

export const useRolloverRewards = () => {
  const rolloverRewardInNativeToken = useSelector((state: State) => state.summitEcosystem.rolloverRewardInNativeToken)
  const summitPrice = useSummitPrice()
  const nativePrice = useNativeTokenPrice()

  return {
    rolloverRewardInNativeToken,
    rolloverRewardInSummit: rolloverRewardInNativeToken.div(summitPrice.dividedBy(nativePrice)),
  }
}
export const useTotalValue = (elevation?: Elevation): BigNumber => {
  const farms = useFarms()
  const pricesPerToken = usePricesPerToken()

  return useMemo(
    () => farms
      .reduce((accumValue, farm) => {
        let crossElevSupplyRaw = new BigNumber(0)
        elevationUtils.all
          .filter((elev) => elevation == null ? true : elev === elevation)
          .forEach((elev) => {
            crossElevSupplyRaw = crossElevSupplyRaw.plus(farm.elevations[elev].supply)
          })
        return accumValue.plus((crossElevSupplyRaw || new BigNumber(0)).div(new BigNumber(10).pow(farm.decimals || 18)).times(pricesPerToken != null && pricesPerToken[farm.symbol] ? pricesPerToken[farm.symbol] : new BigNumber(1)))
      }, new BigNumber(0)),
    [farms, pricesPerToken, elevation]
  )
}

export const useUserTVLs = () => {
  const farms = useFarms()
  const pricesPerToken = usePricesPerToken()

  return useMemo(
    () => {
      let totalTVL = BN_ZERO
      const elevTVL = {
        [Elevation.OASIS]: BN_ZERO,
        [Elevation.PLAINS]: BN_ZERO,
        [Elevation.MESA]: BN_ZERO,
        [Elevation.SUMMIT]: BN_ZERO,
      }

      farms.forEach((farm) => {
        const tokenPrice = pricesPerToken != null && pricesPerToken[farm.symbol] ? pricesPerToken[farm.symbol] : new BigNumber(1)
        const bnDecimals = new BigNumber(10).pow(farm.decimals || 18)
        elevationUtils.all.forEach((elevation) => {
          const supply: BigNumber = farm.elevations[elevation]?.supply || BN_ZERO
          if (supply.isEqualTo(0)) return
          const value = supply.div(bnDecimals).times(tokenPrice)
          totalTVL = totalTVL.plus(value)
          elevTVL[elevation] = elevTVL[elevation].plus(value)
        })
      })

      return {
        totalTVL,
        elevTVL,
      }
    },
    [farms, pricesPerToken]
  )
}

export const useExpeditionPotTotalValue = (): number => {
  return 0
  // const { account } = useWallet()
  // const { expeditions } = useExpeditions(account)
  // const pricesPerToken = usePricesPerToken()
  // const expeditionPotTotalValue = useSelector((state: State) => state.summitEcosystem.expeditionPotTotalValue)

  // return useMemo(
  //   () => {
  //     const expeditionsRewards = expeditions.reduce((acc, expedition) => {
  //       const rewardsRemaining = getBalanceNumber(expedition.rewardsRemaining || new BigNumber(0), expedition.rewardToken.decimals)
  //       const expeditionTokenPrice = (pricesPerToken != null && pricesPerToken[expedition.rewardToken.symbol] ? pricesPerToken[expedition.rewardToken.symbol].toNumber() : 1)
  //       const rewardsDisbursed = expedition.disbursedOffset || 0
  //       const rewardsBonusRemaining = expedition.bonusRewardsRemaining || 0
  //       return acc + ((rewardsRemaining - rewardsDisbursed + rewardsBonusRemaining) * expeditionTokenPrice)
  //     }, 0)
  //     return (expeditionsRewards || 0) + expeditionPotTotalValue
  //   },
  //   [expeditions, expeditionPotTotalValue, pricesPerToken]
  // )
}

export const useExpeditionDisbursedValue = (): number => {
  return 0
  // const { account } = useWallet()
  // const { expeditions } = useExpeditions(account)
  // const pricesPerToken = usePricesPerToken()

  // return useMemo(
  //   () => {
  //     const expeditionsRewards = expeditions.reduce((acc, expedition) => {
  //       const expeditionTokenPrice = (pricesPerToken != null && pricesPerToken[expedition.rewardToken.symbol] ? pricesPerToken[expedition.rewardToken.symbol].toNumber() : 1)
  //       const emissionsDisbursed = getBalanceNumber((expedition.totalEmission || new BigNumber(0)).minus(expedition.rewardsRemaining || new BigNumber(0)), expedition.rewardToken.decimals)
  //       return acc + ((expedition.disbursedOffset + emissionsDisbursed) * expeditionTokenPrice)
  //     }, 0)
  //     return expeditionsRewards
  //   },
  //   [expeditions, pricesPerToken]
  // )
}

// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPricesAsync())
  }, [dispatch, slowRefresh])
}

// SummitEcosystem
export const useFetchSummitEnabled = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchSummitEcosystemEnabledAsync())
  }, [dispatch, fastRefresh])
}

export const useSummitEnabled = () => useSelector((state: State) => state.summitEcosystem.summitEnabled)

export const useElevationsInfo = (): Map<Elevation, ElevationInfo> => {
  return useSelector((state: State) => state.summitEcosystem.elevationsInfo)
}
export const useElevationInfo = (elevation: Elevation): ElevationInfo | null => {
  return useSelector(
    (state: State) =>
      state.summitEcosystem.elevationsInfo[elevationUtils.elevationToElevationDataIndex(elevation)] || null,
  )
}

export const useSingleFarmSelected = (): string | null => {
  const location = useLocation()
  const farmConfigs = useFarmConfigs()

  return useMemo(() => {
    const pathSplit = location.pathname.split('/')
    const lpLabel = pathSplit[2]
    if (lpLabel == null) return null

    const singleFarm = farmConfigs.find(
      (farm) => `${farm.symbol.toLowerCase()}` === lpLabel,
    )

    return singleFarm != null ? singleFarm.symbol : null
  }, [location, farmConfigs])
}

export const useElevationFarmsTab = (): ElevationFarmTab | null => {
  const location = useLocation()

  return useMemo(() => {
    const keyPath = location.pathname.split('/')[1]
    switch (keyPath) {
      case 'elevations': 
        return ElevationFarmTab.DASH
      case 'oasis':
        return ElevationFarmTab.OASIS
      case 'plains':
        return ElevationFarmTab.PLAINS
      case 'mesa':
        return ElevationFarmTab.MESA
      case 'summit':
        return ElevationFarmTab.SUMMIT
      default:
        return null
    }
  }, [location])
}

export const useSelectedElevation = (): Elevation | null => {
  const location = useLocation()

  return useMemo(() => {
    const keyPath = location.pathname.split('/')[1]
    switch (keyPath) {

      case 'oasis':
        return Elevation.OASIS
      case 'plains':
        return Elevation.PLAINS
      case 'mesa':
        return Elevation.MESA
      case 'summit':
        return Elevation.SUMMIT
      case 'expedition':
        return Elevation.EXPEDITION
      default:
        return null
    }
  }, [location])
}
export const useSelectedElevationInfo = (): ElevationInfo | null => {
  const elevation = useSelectedElevation()
  return useElevationInfo(elevation)
}

export const useTotemSelectionPending = (): boolean => {
  return useSelector((state: State) => state.summitEcosystem.pendingTotemSelection)
}

export const useElevationTotems = (): Map<Elevation, number | null> => {
  return useSelector((state: State) => state.summitEcosystem.totems)
}
export const useElevationTotem = (elevation: Elevation): number | null => {
  return useSelector((state: State) => state.summitEcosystem.totems[elevationUtils.toInt(elevation)])
}
export const useElevationUnlockTimestamp = (elevation: Elevation): number => {
  const elevationInfo = useElevationInfo(elevation)

  return useMemo(() => elevationInfo?.unlockTimestamp || 1641028149, [elevationInfo])
}
export const useElevationRoundNumber = (elevation: Elevation): number | undefined => {
  const elevationInfo = useElevationInfo(elevation)

  return useMemo(() => elevationInfo?.roundNumber, [elevationInfo])
}
export const useElevationRoundNumbers = (): Array<number | null> => {
  const plainsRound = useSelector(
    (state: State) =>
      state.summitEcosystem.elevationsInfo[elevationUtils.elevationToElevationDataIndex(Elevation.PLAINS)]?.roundNumber,
  )
  const mesaRound = useSelector(
    (state: State) =>
      state.summitEcosystem.elevationsInfo[elevationUtils.elevationToElevationDataIndex(Elevation.MESA)]?.roundNumber,
  )
  const summitRound = useSelector(
    (state: State) =>
      state.summitEcosystem.elevationsInfo[elevationUtils.elevationToElevationDataIndex(Elevation.SUMMIT)]?.roundNumber,
  )
  const expeditionRound = useSelector(
    (state: State) =>
      state.summitEcosystem.elevationsInfo[elevationUtils.elevationToElevationDataIndex(Elevation.EXPEDITION)]
        ?.roundNumber,
  )

  return useMemo(() => [-1, plainsRound, mesaRound, summitRound, expeditionRound], [
    plainsRound,
    mesaRound,
    summitRound,
    expeditionRound,
  ])
}
export const useElevationLocked = (elevation: Elevation): boolean => {
  const elevationRoundNumber = useElevationRoundNumber(elevation)

  return useMemo(() => false || (elevation === Elevation.OASIS ? false : elevationRoundNumber < ElevationUnlockRound[elevation]), [
    elevationRoundNumber,
    elevation,
  ])
}
export const useElevationsLocked = (): boolean[] => {
  const elevationRoundNumbers = useElevationRoundNumbers()

  return useMemo(
    () =>
      elevationUtils.all.map((elevation, index) =>
        elevation === Elevation.OASIS ? false : elevationRoundNumbers[index] < ElevationUnlockRound[elevation],
      ),
    [elevationRoundNumbers],
  )
}
export const useElevationRoundTimeRemaining = (elevation: Elevation): number | null => {
  const elevationInfo = useElevationInfo(elevation)
  const currentTimestamp = useCurrentTimestamp()
  const elevationUnlockTimestamp = useElevationUnlockTimestamp(elevation)

  return useMemo(() => (elevationInfo == null ? null : getTimestampDiff(currentTimestamp, Math.max(elevationUnlockTimestamp, elevationInfo.roundEndTimestamp))), [
    elevationInfo,
    currentTimestamp,
    elevationUnlockTimestamp,
  ])
}
export const useIsElevationLockedUntilRollover = (elevation: Elevation): boolean => {
  const timeRemaining = useElevationRoundTimeRemaining(elevation)
  return useMemo(
    () => timeRemaining <= RoundLockTime && elevation !== Elevation.OASIS,
    [timeRemaining, elevation],
  )
}

// EXPEDITION
export const useExpeditionDivider = (): number => {
  return useSelector((state: State) => state.summitEcosystem.expeditionDivider)
}
export const usePendingExpeditionTx = (): boolean => {
  return useSelector((state: State) => state.summitEcosystem.pendingExpeditionTx)
}

// ELEVATE
const baseSisterFarms = {
  [Elevation.OASIS]: null,
  [Elevation.PLAINS]: null,
  [Elevation.MESA]: null,
  [Elevation.SUMMIT]: null,
  [Elevation.EXPEDITION]: null,
}
export interface SisterFarms {
  [Elevation.OASIS]?: Farm
  [Elevation.PLAINS]?: Farm
  [Elevation.MESA]?: Farm
  [Elevation.SUMMIT]?: Farm
}
export const useSisterFarms = (symbol: string): SisterFarms => {
  return baseSisterFarms
  // const farms = useFarms()

  // return useMemo(() => {
  //   const sisterFarms = baseSisterFarms
  //   farms.forEach((farm) => {
  //     if (farm.symbol !== symbol || !farm.launched) return
  //     sisterFarms[farm.elevation] = farm
  //   })
  //   return sisterFarms
  // }, [farms, symbol])
}
const baseSisterFarmsAvailable = {
  [Elevation.OASIS]: false,
  [Elevation.PLAINS]: false,
  [Elevation.MESA]: false,
  [Elevation.SUMMIT]: false,
}
export const useAvailableSisterElevations = (symbol: string) => {
  const sisterFarms = useSisterFarms(symbol)

  return useMemo(() => {
    const sisterFarmsAvailable = baseSisterFarmsAvailable
    elevationUtils.all.forEach((elevation) => {
      sisterFarmsAvailable[elevation] = sisterFarms[elevation] != null
    })
    return sisterFarmsAvailable
  }, [sisterFarms])
}

// HISTORICAL WINNERS
export const useTotemHistoricalData = (
  elevation: Elevation,
): { recentWinners: number[]; recentWinningsMultipliers: number[]; winsAccum: number[] } => {
  const elevationInfo = useElevationInfo(elevation)
  return useMemo(() => {
    if (elevationInfo == null || elevation === Elevation.OASIS)
      return {
        recentWinners: [],
        recentWinningsMultipliers: [],
        winsAccum: [],
      }
      
    return {
      recentWinners: elevationInfo.prevWinners.slice(0, Math.min(10, elevationInfo.roundNumber + 1)),
      recentWinningsMultipliers: elevationInfo.prevWinningsMultipliers.slice(
        0,
        Math.min(6, elevationInfo.roundNumber + 1),
      ),
      winsAccum: elevationInfo.totemWinAcc,
    }
  }, [elevationInfo, elevation])
}

export const useElevationWinningTotem = (elevation: Elevation) => {
  const elevationLocked = useElevationLocked(elevation)
  const winningTotem = useSelector(
    (state: State) =>
      state.summitEcosystem.elevationsInfo[elevationUtils.elevationToElevationDataIndex(elevation)]?.prevWinners[0],
  )
  const roundNumber = useElevationRoundNumber(elevation)

  return useMemo(() => {
    if ((elevation !== Elevation.OASIS && elevation !== Elevation.EXPEDITION && ForceElevationRetired) || elevationLocked || roundNumber <= 1 || elevation === Elevation.OASIS || winningTotem == null) return -1
    return winningTotem
  }, [elevation, elevationLocked, winningTotem, roundNumber])
}


export const useWinningTotems = () => {
  const plainsTotem = useElevationWinningTotem(Elevation.PLAINS)
  const mesaTotem = useElevationWinningTotem(Elevation.MESA)
  const summitTotem = useElevationWinningTotem(Elevation.SUMMIT)
  const expeditionTotem = useElevationWinningTotem(Elevation.EXPEDITION)

  return useMemo(() => [-1, plainsTotem, mesaTotem, summitTotem, expeditionTotem], [
    plainsTotem,
    mesaTotem,
    summitTotem,
    expeditionTotem,
  ])
}

export const useSelectedElevationWinningTotem = () => {
  const elevation = useSelectedElevation()
  return  useElevationWinningTotem(elevation)
}

// THEME
export const usePageForcedDarkMode = () => {
  const elevation = useSelectedElevation()
  const { setPageForcedDark } = useTheme()

  useEffect(() => setPageForcedDark(elevation === Elevation.EXPEDITION), [elevation, setPageForcedDark])
}


// EPOCHS
const useEpochs = () => useSelector((state: State) => state.glacier.epochs)
export const useCurrentEpochIndex = () => useSelector((state: State) => state.glacier.currentEpochIndex)
export const useEpochVariableTickTimestamp = (epoch: number, toEpochEnd = false) => {
  const currentTimestamp = useCurrentTimestamp()
  return useMemo(() => {
    const maxTimestamp = toEpochEnd ? epochEndTimestamp(epoch) : epochThawTimestamp(epoch)
    if (currentTimestamp > maxTimestamp) return maxTimestamp
    if ((maxTimestamp - currentTimestamp) > (24 * 3600)) return (Math.floor(currentTimestamp / 3600) * 3600) + 1800
    if ((maxTimestamp - currentTimestamp) > 3600) return (Math.floor(currentTimestamp / 60) * 60) + 30
    return currentTimestamp
  }, [currentTimestamp, epoch, toEpochEnd])
}
export const useEpochByIndex = (epochIndex: number) => {
  const epochs = useEpochs()

  return useMemo(
    () => epochs.find((epoch) => epoch.index === epochIndex) || {
      index: epochIndex,
      frozenSummit: BN_ZERO,
      isThawed: false,
    },
    [epochs, epochIndex]
  )
}
export const useCurrentEpoch = () => {
  const epochs = useEpochs()
  const currentEpochIndex = useCurrentEpochIndex()

  return useMemo(
    () => epochs.find((epoch) => epoch.index === currentEpochIndex) || {
      index: currentEpochIndex,
      frozenSummit: BN_ZERO,
      isThawed: false,
    },
    [epochs, currentEpochIndex]
  )
}
export const useThawedEpochs = () => {
  const epochs = useEpochs()
  return useMemo(
    () => epochs.filter((epoch) => epoch.isThawed),
    [epochs]
  )
}
export const useFrozenEpochs = () => {
  const epochs = useEpochs()
  const currentEpochIndex = useCurrentEpochIndex()

  return useMemo(
    () => epochs.filter((epoch) => !epoch.isThawed && epoch.index !== currentEpochIndex),
    [epochs, currentEpochIndex]
  )
}



// EVEREST
export const useEverestInfo = () => {
  const totalSummitLocked: BigNumber = useSelector((state: State) => state.everest.totalSummitLocked)
  const averageLockDuration: number = useSelector((state: State) => state.everest.averageLockDuration)
  const everestSupply: BigNumber = useSelector((state: State) => state.everest.everestSupply)
  return useMemo(
    () => ({
      totalSummitLocked,
      averageLockDuration,
      everestSupply
    }),
    [totalSummitLocked, averageLockDuration, everestSupply]
  )
}
export const useEverestUserInfo = (): EverestUserData | undefined => {
  return useSelector((state: State) => state.everest.userData)
}
export const useEverestDataLoaded = () => {
  const userInfo = useEverestUserInfo()
  return useMemo(
    () => userInfo != null,
    [userInfo]
  )
}
export const useUserHasLockedSummit = () => {
  const userInfo = useEverestUserInfo()
  return useMemo(
    () => (userInfo?.summitLocked || BN_ZERO).isGreaterThan(0),
    [userInfo]
  )
}


// UI
export const useCurrentSummitPalette = (): SummitPalette => {
  const location = useLocation()

  return useMemo(() => {
    const keyPath = location.pathname.split('/')[1]
    switch (keyPath) {
      case 'everest':
        return SummitPalette.EVEREST
      case 'oasis':
        return SummitPalette.OASIS
      case 'plains':
        return SummitPalette.PLAINS
      case 'mesa':
        return SummitPalette.MESA
      case 'summit':
        return SummitPalette.SUMMIT
      case 'expedition':
        return SummitPalette.EXPEDITION
      default:
        return SummitPalette.BASE
    }
  }, [location])
}

import { createSelector } from "@reduxjs/toolkit";
import { FarmType } from "state/types";
import { stateToFarms, stateToFarmTypeFilter, stateToFarmLiveFilter, stateToTokenInfos, stateToFarmsElevationData, stateToLifetimeSummitBonuses, stateToLifetimeSummitWinnings, stateToFarmsUserDataLoaded } from "./base";
import { getFarmInteracting, getFarmType, getFormattedBigNumber } from "utils"
import { BN_ZERO, Elevation, elevationUtils } from "config/constants";
import { useSelector } from "./utils";
import BigNumber from "bignumber.js";
import { orderBy } from "lodash";



const selectFilteredPartitionedFarmSymbols = createSelector(
    stateToFarms,
    stateToFarmTypeFilter,
    stateToFarmLiveFilter,
    (_, account) => account,
    (farms, farmType, liveFarms, account) => {
        const staked: string[] = []
        const unstaked: string[] = []

        farms.forEach((farm) => {
            const visible = liveFarms === ((farm.allocation || 0) > 0) &&
                (farmType === FarmType.All || getFarmType(farm) === farmType)

            if (!visible || account == null) return

            if (getFarmInteracting(farm)) {
                staked.push(farm.symbol)
            } else {
                unstaked.push(farm.symbol)
            }
        })
        
        return [staked, unstaked]
    }
)

export const useFilteredPartitionedFarmSymbols = (account: string | null) => useSelector((state) => selectFilteredPartitionedFarmSymbols(state, account))

export const makeSelectFarmBySymbol = () => createSelector(
    stateToFarms,
    (_, symbol: string) => symbol,
    (farms, symbol) => farms.find((farm) => farm.symbol === symbol)
)

const selectFarmAndUserTokenInteractionSectionInfo = createSelector(
    stateToFarms,
    stateToTokenInfos,
    (_: any, symbol: string) => symbol,
    (_: any, _2: any, elevation: Elevation) => elevation,
    (farms, tokenInfos, symbol, elevation) => {
        const farm = farms.find((f) => f.symbol === symbol)
        const tokenInfo = tokenInfos.find((tI) => tI.symbol === symbol)
        return {
            // FARM INFO
            farmToken: farm.farmToken,
            depositFeeBP: farm.depositFeeBP,
            decimals: farm.decimals,
            taxBP: farm.taxBP,
            passthroughStrategy: farm.passthroughStrategy,
            getUrl: farm.getUrl,
        
            // FARM ELEVATION INFO
            elevStaked: farm.elevations[elevation]?.stakedBalance || BN_ZERO,
            elevClaimable: farm.elevations[elevation]?.claimable || BN_ZERO,
        
            // TOKEN INFO
            farmAllowance: tokenInfo.farmAllowance,
            walletBalance: tokenInfo.walletBalance,
        }
    }
)
export const useFarmAndUserTokenInteractionSectionInfo = (symbol: string, elevation: Elevation) => useSelector((state) => selectFarmAndUserTokenInteractionSectionInfo(state, symbol, elevation))


const selectFarmUserTokenSectionInfo = createSelector(
    stateToFarms,
    stateToTokenInfos,
    (_, symbol: string) => symbol,
    (farms, tokenInfos, symbol) => {
        const farm = farms.find((f) => f.symbol === symbol)
        const tokenInfo = tokenInfos.find((tI) => tI.symbol === symbol)
        return {
            depositFeeBP: farm.depositFeeBP,

            maxTaxBP: farm.taxBP,
            minTaxBP: farm.native ? 0 : 100,
            currentTaxBP: tokenInfo.taxBP,
            taxResetTimestamp: tokenInfo.taxResetTimestamp,

            currentBonusBP: tokenInfo.bonusBP,
            bonusResetTimestamp: tokenInfo.bonusResetTimestamp,
        }
    }
)
export const useFarmUserTokenSectionInfo = (symbol: string) => useSelector((state) => selectFarmUserTokenSectionInfo(state, symbol))

export const useSummitPrice = () => useSelector((state) => state.prices.pricesPerToken?.SUMMIT || new BigNumber(1.5))

const selectSymbolElevateModalInfo = createSelector(
    stateToFarms,
    (_: any, symbol: string) => symbol,
    (farms, symbol) => {
        const farm = farms.find((f) => f.symbol === symbol)

        const elevLaunched = {
            [Elevation.OASIS]: false,
            [Elevation.PLAINS]: false,
            [Elevation.MESA]: false,
            [Elevation.SUMMIT]: false,
        }
        const elevClaimable = {
            [Elevation.OASIS]: BN_ZERO,
            [Elevation.PLAINS]: BN_ZERO,
            [Elevation.MESA]: BN_ZERO,
            [Elevation.SUMMIT]: BN_ZERO,
        }
        const elevStaked = {
            [Elevation.OASIS]: BN_ZERO,
            [Elevation.PLAINS]: BN_ZERO,
            [Elevation.MESA]: BN_ZERO,
            [Elevation.SUMMIT]: BN_ZERO,
        }
        elevationUtils.all.forEach((elev) => {
            elevLaunched[elev] = elev === Elevation.OASIS || farm.elevations[elev]?.launched || false
            elevClaimable[elev] = farm.elevations[elev]?.claimable || BN_ZERO
            elevStaked[elev] = farm.elevations[elev]?.stakedBalance || BN_ZERO
        })
        return {
            elevLaunched,
            elevClaimable,
            elevStaked,
            decimals: farm.decimals,
            farmToken: farm.farmToken,
        }
    }
)
export const useSymbolElevateModalInfo = (symbol: string) => useSelector((state) => selectSymbolElevateModalInfo(state, symbol))

const selectSymbolElevateSelectorInfo = createSelector(
    selectSymbolElevateModalInfo,
    ({ elevLaunched }) => elevLaunched
)
export const useSymbolElevateSelectorInfo = (symbol: string) => useSelector((state) => selectSymbolElevateSelectorInfo(state, symbol))

const selectFarmsWithClaimable = createSelector(
    stateToFarms,
    (_, elevation: Elevation) => elevation,
    (farms, elevation) => farms
        .map((farm) => ({
            symbol: farm.symbol,
            claimable: farm.elevations[elevation]?.claimable || BN_ZERO
        }))
        .filter((farm) => farm.claimable.isGreaterThan(0))
)
const selectElevationWinningsContributions = createSelector(
    selectFarmsWithClaimable,
    (farmsWithClaimable) => {
        const sortedClaimables = orderBy(
            farmsWithClaimable,
            (farmWithClaimable) => farmWithClaimable.claimable.toNumber(),
            'desc'
        )
        
        const contributionSum = sortedClaimables.reduce((acc, sortedClaimable) => acc.plus(sortedClaimable.claimable), BN_ZERO)
        
        return sortedClaimables.map((sortedClaimable, index) => ({
            token: true,
            title: sortedClaimable.symbol,
            key: index,
            perc: sortedClaimable.claimable.times(100).div(contributionSum).toNumber(),
            val: `${getFormattedBigNumber(sortedClaimable.claimable)} SUMMIT`,
        }))
    }
)
export const useElevationWinningsContributions = (elevation: Elevation) => useSelector((state) => selectElevationWinningsContributions(state, elevation))

const selectUserElevationClaimable = createSelector(
    stateToFarmsElevationData,
    (elevationData) => elevationData?.claimable || BN_ZERO
)
export const useUserElevationClaimable = (elevation: Elevation) => useSelector((state) => selectUserElevationClaimable(state, elevation))


const selectLifetimeSummitWinningsAndBonus = createSelector(
    stateToLifetimeSummitWinnings,
    stateToLifetimeSummitBonuses,
    (lifetimeSummitWinnings, lifetimeSummitBonuses) => ({
        lifetimeSummitWinnings,
        lifetimeSummitBonuses,
    })
)
export const useLifetimeSummitWinningsAndBonus = () => useSelector(selectLifetimeSummitWinningsAndBonus)


const selectFarmsWithYield = createSelector(
    stateToFarms,
    (_, elevation: Elevation) => elevation,
    (farms, elevation) => farms
        .map((farm) => ({
            symbol: farm.symbol,
            yieldContributed: farm.elevations[elevation]?.yieldContributed || BN_ZERO
        }))
        .filter((farm) => farm.yieldContributed.isGreaterThan(0))
)
const selectElevationYieldBetContributions = createSelector(
    selectFarmsWithYield,
    (farmsWithYield) => {
        const sortedYields = orderBy(
            farmsWithYield,
            (farmWithYield) => farmWithYield.yieldContributed.toNumber(),
            'desc'
        )
        
        const yieldSum = sortedYields.reduce((acc, sortedYield) => acc.plus(sortedYield.yieldContributed), BN_ZERO)
        
        return sortedYields.map((sortedYield, index) => ({
            token: true,
            title: sortedYield.symbol,
            key: index,
            perc: sortedYield.yieldContributed.times(100).div(yieldSum).toNumber(),
            val: `${getFormattedBigNumber(sortedYield.yieldContributed)} SUMMIT`,
        }))
    }
)
export const useElevationYieldBetContributions = (elevation: Elevation) => useSelector((state) => selectElevationYieldBetContributions(state, elevation))

const selectUserElevationYieldInfo = createSelector(
    stateToFarmsElevationData,
    (elevationData) => ({
        yieldContributed: elevationData?.yieldContributed || BN_ZERO,
        potentialWinnings: elevationData?.potentialWinnings || BN_ZERO,
    })
)
export const useUserElevationYieldInfo = (elevation: Elevation) => useSelector((state) => selectUserElevationYieldInfo(state, elevation))

const selectFarmsUserDataLoaded = createSelector(
    stateToFarmsUserDataLoaded,
    (userDataLoaded) => userDataLoaded
)

export const useFarmsUserDataLoaded = () => useSelector(selectFarmsUserDataLoaded)



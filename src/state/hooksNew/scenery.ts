import { createSelector } from "@reduxjs/toolkit";
import { BN_ZERO, Elevation, elevationUtils, getPresetStrategy, RoadmapStrategy, TokenSymbol } from "config/constants";
import { useSelector } from "./utils";
import { stateToAvgStakingLoyaltyDuration, stateToEverestUserData, stateToExpeditionDeity, stateToExpeditionFaith, stateToFarms, stateToFarmsUserDataLoaded, stateToGlacierTotalFrozenSummit, stateToPricesPerToken, stateToSelectedPresetStrategy, stateToTotemSelectionRounds, stateToWinningDeity } from "./base";
import { selectFarmBySymbol } from "./farm";
import { selectUserTotemsAndCrowns } from "./totem";
import { selectElevationsRoundNumbers } from "./rounds";
import { groupByAndMap } from "utils";
import BigNumber from "bignumber.js";

const selectUserElevationTVLs = createSelector(
    stateToFarms,
    stateToPricesPerToken,
    (farms, pricesPerToken) => {
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
            const staked = farm.elevations[elevation]?.stakedBalance || BN_ZERO
            if (staked.isEqualTo(0)) return
                const value = staked.div(bnDecimals).times(tokenPrice)
                totalTVL = totalTVL.plus(value)
                elevTVL[elevation] = elevTVL[elevation].plus(value)
            })
        })

        return {
            totalTVL,
            elevTVL,
        }
    }
)

export const useAvgStakingLoyaltyDuration = () => useSelector(stateToAvgStakingLoyaltyDuration)

const selectRoadmapEverestInfoWithPreset = createSelector(
    stateToEverestUserData,
    stateToGlacierTotalFrozenSummit,
    (state) => selectFarmBySymbol(state, TokenSymbol.SUMMIT),
    (everestUserData, totalFrozenSummit, summitFarmInfo) => {
        const totalSummitOwned = (everestUserData?.summitLocked || BN_ZERO)
            .plus(totalFrozenSummit || BN_ZERO)
            .plus(summitFarmInfo?.elevations?.OASIS?.stakedBalance || BN_ZERO)
            .plus(summitFarmInfo?.elevations?.PLAINS?.stakedBalance || BN_ZERO)
            .plus(summitFarmInfo?.elevations?.MESA?.stakedBalance || BN_ZERO)
            .plus(summitFarmInfo?.elevations?.SUMMIT?.stakedBalance || BN_ZERO)

        const lockPerc = totalSummitOwned.isGreaterThan(0) ?
            `${(everestUserData?.summitLocked || BN_ZERO).times(100).dividedBy(totalSummitOwned).toNumber().toFixed(1)}%` :
            '0%'

        return {
            isPreset: false,
            
            everestOwned: everestUserData?.everestOwned,
            summitLocked: everestUserData?.summitLocked,
            lockDuration: everestUserData?.lockDuration,
            everestLockMult: everestUserData?.everestLockMult,
            lockPerc
        }
    }
)
export const useRoadmapEverestInfoWithPreset = () => useSelector(selectRoadmapEverestInfoWithPreset)

const selectUserStrategy = createSelector(
    stateToFarmsUserDataLoaded,
    selectUserTotemsAndCrowns,
    stateToTotemSelectionRounds,
    selectElevationsRoundNumbers,
    stateToEverestUserData,
    stateToAvgStakingLoyaltyDuration,
    stateToGlacierTotalFrozenSummit,
    (state) => selectFarmBySymbol(state, TokenSymbol.SUMMIT),
    stateToExpeditionFaith,
    selectUserElevationTVLs,
    (userDataLoaded, userTotemsAndCrowns, totemSelectionRounds, roundNumbers, everestUserData, avgStakingLoyaltyDuration, glacierFrozenSummit, summitFarmInfo, faith, { totalTVL, elevTVL }): RoadmapStrategy => {
        if (!userDataLoaded) return null
        const expedInt = elevationUtils.toInt(Elevation.EXPEDITION)
        return {
            name: 'Test',
            description: 'Test',
            farming: {
                averageFarmLoyalty: avgStakingLoyaltyDuration,
                ...groupByAndMap(
                    elevationUtils.all,
                    (elev) => elev,
                    (elev) => {
                        const elevInt = elevationUtils.toInt(elev)
                        const roundNumber = elev === Elevation.OASIS ? 0 : roundNumbers[elevInt - 1]
                        return {
                            totem: userTotemsAndCrowns[elevInt].userTotem,
                            crowned: userTotemsAndCrowns[elevInt].crowned,
                            loyalty: roundNumber - totemSelectionRounds[elevInt],
                            staked: elevTVL[elev],
                            perc: elevTVL[elev].times(100).div(totalTVL).toNumber()
                        }
                    }
                ) as any
            },
            EVEREST: {
                lockedPerc: 50,
                lockDuration: 30,
            },
            [Elevation.EXPEDITION]: {
                deity: userTotemsAndCrowns[expedInt]?.userTotem || null,
                crowned: userTotemsAndCrowns[expedInt]?.crowned || false,
                deityLoyalty: roundNumbers[expedInt - 1] - totemSelectionRounds[expedInt],
                faith,
            }
        }
    }
)

export const useUserRoadmapStrategy = () => useSelector(selectUserStrategy)


const selectUserTotemLoyalties = createSelector(
    stateToTotemSelectionRounds,
    selectElevationsRoundNumbers,
    (selectionRounds, elevationRounds) => {
        return elevationUtils.allWithExpedition.map((elevation) => {
            if (elevation === Elevation.OASIS) return -1
            const round = elevationRounds[elevationUtils.toInt(elevation) - 1]
            if (round === 0 || round == null) return -1
            const selectionRound = selectionRounds[elevationUtils.toInt(elevation)]
            if ((round - selectionRound) <= 1) return -2
            return round - selectionRound
        })
    }
)
export const useUserTotemLoyalties = () => useSelector(selectUserTotemLoyalties)


const selectExpeditionRoadmapInfoWithPreset = createSelector(
    stateToSelectedPresetStrategy,
    stateToExpeditionDeity,
    stateToExpeditionFaith,
    stateToWinningDeity,
    selectUserTotemLoyalties,
    (presetStrategy, deity, faith, winningDeity, totemLoyalties) => {
        if (presetStrategy != null) return {
            isPreset: true,
            crowned: false,
            ...getPresetStrategy(presetStrategy).expedition,
        }
        return {
            isPreset: false,
            deity,
            crowned: deity != null && deity === winningDeity,
            faith,
            loyalty: totemLoyalties[elevationUtils.toInt(Elevation.EXPEDITION)]
        }
    }
)
export const useExpeditionRoadmapInfoWithPreset = () => useSelector(selectExpeditionRoadmapInfoWithPreset)



const selectUserTotemCrownsLoyaltiesWithPreset = createSelector(
    stateToSelectedPresetStrategy,
    selectUserTotemsAndCrowns,
    selectUserTotemLoyalties,
    (presetStrategy, totemsAndCrowns, loyalties) => {
        if (presetStrategy != null) return {
            isPreset: true,
            totemsCrownsLoyalties: Object.values(getPresetStrategy(presetStrategy).totems)
                .map(({ totem, crowned, loyalty}) => ({
                    userTotem: totem,
                    crowned,
                    loyalty
                }))
        }

        return {
            isPreset: false,
            totemsCrownsLoyalties: totemsAndCrowns.map(({ userTotem, crowned }, index) => ({
                userTotem,
                crowned,
                loyalty: loyalties[index],
            }))
        }
    }
)
export const useUserTotemCrownsLoyaltiesWithPreset = () => useSelector(selectUserTotemCrownsLoyaltiesWithPreset)

const selectPresetStrategyTVLContributions = createSelector(
    stateToSelectedPresetStrategy,
    (presetStrategy) => {
        if (presetStrategy == null) return {
            isPreset: false,
            avgStakingDuration: null,
            contributions: null
        }

        const { farming: { avgStakingDuration, contributions } } = getPresetStrategy(presetStrategy)

        return {
            isPreset: true,
            avgStakingDuration,
            contributions: elevationUtils.all
                .map((elev, elevIndex) => ({
                    title: elev,
                    elevation: true,
                    key: elevIndex,
                    perc: contributions[elev] as number,
                }))
                .filter((contrib) => contrib.perc > 0)
        }
    }
)
export const usePresetStrategyTVLContributions = () => useSelector(selectPresetStrategyTVLContributions)

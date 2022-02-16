import { createSelector } from "@reduxjs/toolkit";
import { BN_ZERO, Elevation, elevationUtils, SceneryStrategy, TokenSymbol } from "config/constants";
import { useSelector } from "./utils";
import { stateToAvgStakingLoyaltyDuration, stateToElevationInfo, stateToElevationsInfos, stateToEverestUserData, stateToExpeditionFaith, stateToFarms, stateToFarmsLoaded, stateToFarmsUserDataLoaded, stateToGlacierTotalFrozenSummit, stateToPricesPerToken, stateToTotemSelectionRounds, stateToUserTotems } from "./base";
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

        console.log({
            yeahIfetchedIt: true
        })

        return {
            totalTVL,
            elevTVL,
        }
    }
)

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
    (userDataLoaded, userTotemsAndCrowns, totemSelectionRounds, roundNumbers, everestUserData, avgStakingLoyaltyDuration, glacierFrozenSummit, summitFarmInfo, faith, { totalTVL, elevTVL }): SceneryStrategy => {
        if (!userDataLoaded) return null
        const expedInt = elevationUtils.toInt(Elevation.EXPEDITION)
        console.log({
            elevTVL,
            totalTVL
        })
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

export const useUserSceneryStrategy = () => useSelector(selectUserStrategy)


const selectUserTotemLoyalties = createSelector(
    stateToTotemSelectionRounds,
    selectElevationsRoundNumbers,
    (selectionRounds, elevationRounds) => {
        return elevationUtils.allWithExpedition.map((elevation) => {
            const round = elevationRounds[elevationUtils.toInt(elevation)]
            if (round === 0) return -1
            return round - selectionRounds[elevationUtils.toInt(elevation)]
        })
    }
)
export const useUserTotemLoyalties = () => useSelector(selectUserTotemLoyalties)
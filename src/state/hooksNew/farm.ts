import { createSelector } from "@reduxjs/toolkit";
import { FarmType } from "state/types";
import { stateToFarms, stateToFarmTypeFilter, stateToFarmLiveFilter, stateToTokenInfos } from "./base";
import { getFarmInteracting, getFarmType } from "utils"
import { BN_ZERO, Elevation } from "config/constants";
import { useSelector } from "./utils";
import BigNumber from "bignumber.js";



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
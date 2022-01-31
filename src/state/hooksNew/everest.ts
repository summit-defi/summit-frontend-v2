import { createSelector } from "@reduxjs/toolkit";
import { stateToEverestTotalSummitLocked, stateToEverestAverageLockDuration, stateToEverestSupply, stateToEverestUserData } from "./base";
import { useSelector } from "./utils";

const selectEverestStatsInfo = createSelector(
    stateToEverestTotalSummitLocked,
    stateToEverestAverageLockDuration,
    stateToEverestSupply,
    (totalSummitLocked, averageLockDuration, everestSupply) => ({
        totalSummitLocked,
        averageLockDuration,
        everestSupply,
    })
)
export const useEverestStatsInfo = () => useSelector(selectEverestStatsInfo)

export const useEverestUserInfo = () => useSelector(stateToEverestUserData)

const selectEverestUserDataLoaded = createSelector(
    stateToEverestUserData,
    (userData) => userData != null
)
export const useEverestDataLoaded = () => useSelector(selectEverestUserDataLoaded)

import { createSelector } from "@reduxjs/toolkit";
import { stateToEverestTotalSummitLocked, stateToEverestAverageLockDuration, stateToEverestSupply, stateToEverestUserData, stateToUserEverestOwned } from "./base";
import { useSelector } from "./utils";

const selectEverestStatsInfo = createSelector(
    stateToEverestTotalSummitLocked,
    stateToEverestAverageLockDuration,
    stateToEverestSupply,
    stateToUserEverestOwned,
    (totalSummitLocked, averageLockDuration, everestSupply, userEverestOwned) => ({
        totalSummitLocked,
        averageLockDuration,
        everestSupply,
        userEverestOwned,
    })
)
export const useEverestStatsInfo = () => useSelector(selectEverestStatsInfo)

export const useEverestUserInfo = () => useSelector(stateToEverestUserData)

const selectEverestUserDataLoaded = createSelector(
    stateToEverestUserData,
    (userData) => userData != null
)
export const useEverestDataLoaded = () => useSelector(selectEverestUserDataLoaded)

export const useEverestSummitLocked = () => useSelector(stateToEverestTotalSummitLocked)
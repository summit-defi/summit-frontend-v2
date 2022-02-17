import { createSelector } from "@reduxjs/toolkit";
import { stateToSummitSwapMinimized, stateToElevationRolloversToShow, stateToFarmsUserDataLoaded, stateToSceneryScreenshot, stateToUserStrategyName, stateToUserStrategyDescription, stateToUserStrategyOwner } from "./base";
import { useSelector } from "./utils";

export const useSummitSwapMinimized = () => useSelector(stateToSummitSwapMinimized)

const selectElevationRolloversToShow = createSelector(
    stateToElevationRolloversToShow,
    stateToFarmsUserDataLoaded,
    (elevationRolloversToShow, userDataLoaded) => userDataLoaded ? elevationRolloversToShow : []
)
export const useElevationRolloversToShow = () => useSelector(selectElevationRolloversToShow)

export const useSceneryScreenshot = () => useSelector(stateToSceneryScreenshot)

const selectUserStrategyNameAndDescription = createSelector(
    stateToUserStrategyName,
    stateToUserStrategyOwner,
    stateToUserStrategyDescription,
    (name, owner, description) => ({ name, owner, description })
)
export const useUserStrategyNameAndDescription = () => useSelector(selectUserStrategyNameAndDescription)
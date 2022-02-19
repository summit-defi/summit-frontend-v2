import { createSelector } from "@reduxjs/toolkit";
import { getPresetStrategy } from "config/constants";
import { stateToSummitSwapMinimized, stateToElevationRolloversToShow, stateToFarmsUserDataLoaded, stateToRoadmapScreenshot, stateToUserStrategyTitle, stateToUserStrategyDescription, stateToUserStrategyOwner, stateToSelectedPresetStrategy } from "./base";
import { useSelector } from "./utils";

export const useSummitSwapMinimized = () => useSelector(stateToSummitSwapMinimized)

const selectElevationRolloversToShow = createSelector(
    stateToElevationRolloversToShow,
    stateToFarmsUserDataLoaded,
    (elevationRolloversToShow, userDataLoaded) => userDataLoaded ? elevationRolloversToShow : []
)
export const useElevationRolloversToShow = () => useSelector(selectElevationRolloversToShow)

export const useRoadmapScreenshot = () => useSelector(stateToRoadmapScreenshot)

const selectUserStrategyTitleOwnerDesc = createSelector(
    stateToUserStrategyTitle,
    stateToUserStrategyOwner,
    stateToUserStrategyDescription,
    (title, owner, description) => {
        return { title, owner, description }
    }
)
export const useUserStrategyTitleOwnerDesc = () => useSelector(selectUserStrategyTitleOwnerDesc)
export const useSelectedPresetStrategy = () => useSelector(stateToSelectedPresetStrategy)

const selectUserStrategyTitleOwnerDescWithPreset = createSelector(
    stateToSelectedPresetStrategy,
    selectUserStrategyTitleOwnerDesc,
    (presetStrategy, {title, owner, description}) => {
        if (presetStrategy != null) return { isPreset: true, ...getPresetStrategy(presetStrategy).titleOwnerDesc }
        return { isPreset: false, title, owner, description }
    }
)
export const useUserStrategyTitleOwnerDescWithPreset = () => useSelector(selectUserStrategyTitleOwnerDescWithPreset)

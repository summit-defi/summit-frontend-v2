import { createSelector } from "@reduxjs/toolkit";
import { BN_ZERO, elevationUtils, getPresetStrategy } from "config/constants";
import { stateToSummitSwapMinimized, stateToElevationRolloversToShow, stateToFarmsUserDataLoaded, stateToRoadmapScreenshot, stateToUserStrategyTitle, stateToUserStrategyDescription, stateToUserStrategyOwner, stateToSelectedPresetStrategy, stateToFarmsElevationsData } from "./base";
import { useSelector } from "./utils";

export const useSummitSwapMinimized = () => useSelector(stateToSummitSwapMinimized)

const selectClaimableElevations = createSelector(
    stateToFarmsElevationsData,
    (elevationsData) => {
        return elevationsData
            .map((data, elevIndex) => (data.claimable || BN_ZERO).isGreaterThan(0) ? elevationUtils.fromInt(elevIndex) : null)
            .filter((elev) => elev != null)
    }
)
const selectElevationRolloversToShow = createSelector(
    stateToElevationRolloversToShow,
    stateToFarmsUserDataLoaded,
    selectClaimableElevations,
    (elevationRolloversToShow, userDataLoaded, claimableElevations) => {
        if (!userDataLoaded) return []
        return elevationRolloversToShow.filter((elev) => claimableElevations.includes(elev))
    }
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

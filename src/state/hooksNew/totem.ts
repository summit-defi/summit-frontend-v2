import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "./utils";
import { stateToUserTotems, stateToExpeditionDeity, stateToWinningTotems } from './base'
import { Elevation, elevationUtils } from "config/constants";

const selectUserTotems = createSelector(
    stateToUserTotems,
    stateToExpeditionDeity,
    (totems, deity) => [...totems, deity]
)
export const useUserTotems = () => useSelector(selectUserTotems)

export const makeSelectElevationTotem = () => createSelector(
    selectUserTotems,
    (_, elevation: Elevation) => elevation,
    (totems, elevation) => totems[elevationUtils.toInt(elevation)]
)

export const useWinningTotems = () => useSelector(stateToWinningTotems)

const selectElevationWinningTotem = createSelector(
    stateToWinningTotems,
    (_, elevation: Elevation) => elevation,
    (winningTotems, elevation) => winningTotems[elevationUtils.toInt(elevation)]
)
export const makeSelectElevationWinningTotem = () => selectElevationWinningTotem
export const useElevationWinningTotem = (elevation: Elevation) => useSelector((state) => selectElevationWinningTotem(state, elevation))

export const selectElevationUserTotemAndCrowned = createSelector(
    stateToUserTotems,
    stateToWinningTotems,
    (_, elevation: Elevation) => elevation,
    (userTotems, winningTotems, elevation) => ({
        userTotem: userTotems[elevationUtils.toInt(elevation)],
        crowned: userTotems[elevationUtils.toInt(elevation)] === winningTotems[elevationUtils.toInt(elevation)]
    })
)
export const useElevationUserTotemAndCrowned = (elevation: Elevation) => useSelector((state) => selectElevationUserTotemAndCrowned(state, elevation))
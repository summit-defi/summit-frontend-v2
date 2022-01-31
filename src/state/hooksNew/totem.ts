import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "./utils";
import { stateToUserTotems, stateToExpeditionDeity, stateToWinningTotems, stateToFarmsElevationsData, stateToFarmsElevationData } from './base'
import { Elevation, elevationUtils } from "config/constants";

export const useExpeditionUserDeity = () => useSelector(stateToExpeditionDeity)

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
        crowned: userTotems[elevationUtils.toInt(elevation)] != null && userTotems[elevationUtils.toInt(elevation)] === winningTotems[elevationUtils.toInt(elevation)]
    })
)
export const useElevationUserTotemAndCrowned = (elevation: Elevation) => useSelector((state) => selectElevationUserTotemAndCrowned(state, elevation))

export const selectUserTotemsAndCrowns = createSelector(
    stateToUserTotems,
    stateToWinningTotems,
    (userTotems, winningTotems) => userTotems.map((userTotem, elevIndex) => ({
        userTotem,
        crowned: userTotem != null && userTotem === winningTotems[elevIndex]
    }))
)
export const useUserTotemsAndCrowns = () => useSelector(selectUserTotemsAndCrowns)


export const selectDashboardTotemBattleInfo = createSelector(
    selectUserTotemsAndCrowns,
    stateToFarmsElevationsData,
    (userTotemsAndCrowns, elevationsData) => elevationUtils.elevationOnly
        .map((elev) => {
            const totemAndCrowned = userTotemsAndCrowns[elevationUtils.toInt(elev)]
            return [{
                totem: totemAndCrowned.userTotem,
                crowned: totemAndCrowned.crowned,
                mult: totemAndCrowned.userTotem == null ?
                    elevationUtils.totemCount(elev) :
                    (elevationsData[elevationUtils.toInt(elev)]?.totemMultipliers[totemAndCrowned.userTotem] || 0)
            }]
        })
)
export const useDashboardTotemBattleInfo = () => useSelector(selectDashboardTotemBattleInfo)

export const selectElevationTotemBattleInfo = createSelector(
    selectElevationUserTotemAndCrowned,
    stateToFarmsElevationData,
    (_, elevation: Elevation) => elevation,
    ({ userTotem, crowned }, { totemMultipliers }, elevation) => ({
        userTotem,
        totemInfos: elevationUtils.totemsArray(elevation).map((totem) => ({
            totem,
            crowned: totem === userTotem && crowned,
            mult: totemMultipliers[totem],
        }))
    })
)
export const useElevationTotemBattleInfo = (elevation: Elevation) => useSelector((state) => selectElevationTotemBattleInfo(state, elevation))
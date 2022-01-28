import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { stateToExpeditionUserDataLoaded, stateToExpeditionLoaded, stateToExpeditionSummitRoundEmission, stateToExpeditionUsdcRoundEmission, stateToExpeditionUserData, stateToEnteredExpedition, stateToExpeditionDeitiedSupply, stateToExpeditionDeitySupplies, stateToExpeditionSafeSupply, stateToExpeditionInfo, stateToExpeditionSummitWinnings, stateToExpeditionUsdcWinnings } from './base'

const selectExpeditionLoaded = createSelector(
    stateToExpeditionLoaded,
    stateToExpeditionUserDataLoaded,
    (expeditionLoaded, userDataLoaded) => ({
        expeditionLoaded,
        userDataLoaded
    })
)
export const useExpeditionLoaded = () => useSelector(selectExpeditionLoaded)

const selectExpeditionRoundEmission = createSelector(
    stateToExpeditionSummitRoundEmission,
    stateToExpeditionUsdcRoundEmission,
    (summitRoundEmission, usdcRoundEmission) => ({
        summitRoundEmission,
        usdcRoundEmission
    })
)
export const useExpeditionRoundEmission = () => useSelector(selectExpeditionRoundEmission)

export const useExpeditionUserData = () => useSelector(stateToExpeditionUserData)
export const useEnteredExpedition = () => useSelector(stateToEnteredExpedition)

const selectUserFaithInfo = createSelector(
    stateToExpeditionSummitRoundEmission,
    stateToExpeditionUsdcRoundEmission,
    stateToExpeditionUserData,
    stateToExpeditionSafeSupply,
    stateToExpeditionDeitiedSupply,
    stateToExpeditionDeitySupplies,
    (summitRoundEmission, usdcRoundEmission, userData, safeSupply, deitiedSupply, deitySupplies) => ({
        summitRoundEmission,
        usdcRoundEmission,
        everestOwned: userData.everestOwned,
        safeSupply,
        deitiedSupply,
        selectedDeitySupply: deitySupplies[userData.deity],
        faith: userData.faith,
    })
)
export const useExpeditionUserFaithInfo = () => useSelector(selectUserFaithInfo)

const selectExpeditionStatsInfo = createSelector(
    stateToExpeditionInfo,
    (expedInfo) => ({
        everestStaked: expedInfo.safeEverest.plus(expedInfo.deitiedEverest),

        summitRoundEmission: expedInfo.summit.roundEmission,
        summitEmissionsRemaining: expedInfo.summit.emissionsRemaining,
        summitDistributed: expedInfo.summit.distributed,

        usdcRoundEmission: expedInfo.usdc.roundEmission,
        usdcEmissionsRemaining: expedInfo.usdc.emissionsRemaining,
        usdcDistributed: expedInfo.usdc.distributed,

        roundsRemaining: expedInfo.roundsRemaining,
    })
)
export const useExpeditionStatsInfo = () => useSelector(selectExpeditionStatsInfo)

const selectExpeditionWinnings = createSelector(
    stateToExpeditionSummitWinnings,
    stateToExpeditionUsdcWinnings,
    (summitWinnings, usdcWinnings) => ({
        summitWinnings,
        usdcWinnings,
    })
)
export const useExpeditionWinnings = () => useSelector(selectExpeditionWinnings)
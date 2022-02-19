import { useEffect, useState } from 'react'
import axios from 'axios'
import { groupByAndMap, parseJSON } from 'utils'
import useRefresh from 'hooks/useRefresh'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { stateToExpeditionUserDataLoaded, stateToExpeditionLoaded, stateToExpeditionSummitRoundEmission, stateToExpeditionUsdcRoundEmission, stateToExpeditionUserData, stateToEnteredExpedition, stateToExpeditionDeitiedSupply, stateToExpeditionDeitySupplies, stateToExpeditionSafeSupply, stateToExpeditionInfo, stateToExpeditionSummitWinnings, stateToExpeditionUsdcWinnings, stateToExpeditionFaith, stateToExpeditionDeity, stateToDeityDivider, stateToWinningDeity, stateToTotemSelectionPending, stateToExpeditionEverestOwned, stateToFarms, stateToExpeditionAPR, stateToDebankExpeditionTreasury, stateToExpeditionSummitEmissionsRemaining, stateToExpeditionUsdcEmissionsRemaining, stateToSummitPrice, stateToExpeditionSummitDisbursed, stateToExpeditionUsdcDisbursed } from './base'
import { BN_ZERO, getFarmConfigs } from 'config/constants'
import BigNumber from 'bignumber.js'

const selectExpeditionLoaded = createSelector(
    stateToExpeditionLoaded,
    stateToExpeditionUserDataLoaded,
    (expeditionLoaded, userDataLoaded) => ({
        expeditionLoaded,
        userDataLoaded
    })
)
export const useExpeditionLoaded = () => useSelector(selectExpeditionLoaded)

const selectExpeditionEntryFlow = createSelector(
    stateToExpeditionDeity,
    stateToExpeditionFaith,
    stateToExpeditionEverestOwned,
    (deity, faith, everestOwned) => ({
        deity, faith, everestOwned
    })
)
export const useExpeditionEntryFlow = () => useSelector(selectExpeditionEntryFlow)

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
    stateToExpeditionDeity,
    stateToDeityDivider,
    (summitRoundEmission, usdcRoundEmission, userData, safeSupply, deitiedSupply, deitySupplies, userDeity, deityDivider) => ({
        summitRoundEmission,
        usdcRoundEmission,
        everestOwned: userData.everestOwned,
        safeSupply,
        deitiedSupply,
        selectedDeitySupply: deitySupplies[userData.deity],
        faith: userData.faith,
        userDeity,
        deityDivider,
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

const selectExpeditionTotemHeaderInfo = createSelector(
    stateToExpeditionDeity,
    stateToExpeditionFaith,
    stateToExpeditionDeitySupplies,
    stateToDeityDivider,
    stateToWinningDeity,
    stateToTotemSelectionPending,
    (deity, faith, deityEverest, deityDivider, winningDeity, totemSelectionPending) => ({
        deity,
        faith,
        deityEverest,
        deityDivider,
        winningDeity,
        totemSelectionPending
    })
)
export const useExpeditionTotemHeaderInfo = () => useSelector(selectExpeditionTotemHeaderInfo)






// EXPED APR
const selectFarmsTotalVolumes = createSelector(
    stateToFarms,
    (farms) => {
        return groupByAndMap(
            farms.filter((farm) => farm.beefyVaultApiName != null),
            (farm) => farm.symbol,
            (farm) => Object.values(farm.elevations).reduce((vol, elevInfo) => {
                return vol.plus(elevInfo?.supply || BN_ZERO)
            }, BN_ZERO)
        )
    }
)

export const useFarmsTotalVolumes = () => useSelector(selectFarmsTotalVolumes)

export const useFetchFarmBeefyAprs = () => {
    const farmConfigs = getFarmConfigs()
    const initAprs = parseJSON(localStorage.getItem('FarmAprs'), {})
    const [aprs, setAprs] = useState(initAprs)
    const { slowRefresh } = useRefresh()

    useEffect(
        () => {
            axios.get(`https://api.beefy.finance/apy/breakdown`)
                .then(res => {
                    const farmAprs = groupByAndMap(
                        farmConfigs.filter((farm) => farm.beefyVaultApiName != null),
                        (farm) => farm.symbol,
                        (farm) => (res.data[farm.beefyVaultApiName]?.tradingApr || 0) + (res.data[farm.beefyVaultApiName]?.vaultApr || 0)
                    )
                    setAprs(farmAprs)
                })
        },
        [slowRefresh, farmConfigs, setAprs]
    )

    return aprs
}

export const useExpeditionApr = () => useSelector(stateToExpeditionAPR)

const selectExpeditionPotTotalValue = createSelector(
    stateToDebankExpeditionTreasury,
    stateToExpeditionSummitEmissionsRemaining,
    stateToExpeditionUsdcEmissionsRemaining,
    stateToSummitPrice,
    (expeditionDeBankTreasury, summitEmissionsRemaining, usdcEmissionsRemaining, summitPrice) => {
        return expeditionDeBankTreasury +
            summitEmissionsRemaining.times(summitPrice).dividedBy(new BigNumber(10).pow(18)).toNumber() +
            usdcEmissionsRemaining.dividedBy(new BigNumber(10).pow(6)).toNumber()
    }
)

export const useExpeditionPotTotalValue = () => useSelector(selectExpeditionPotTotalValue)


const selectExpeditionDisbursedValue = createSelector(
    stateToExpeditionSummitDisbursed,
    stateToExpeditionUsdcDisbursed,
    stateToSummitPrice,
    (summitDisbursed, usdcDisbursed, summitPrice) => {
        return summitDisbursed.times(summitPrice).dividedBy(new BigNumber(10).pow(18)).toNumber() +
            usdcDisbursed.dividedBy(new BigNumber(10).pow(6)).toNumber()
    }
)
export const useExpeditionDisbursedValue = () => useSelector(selectExpeditionDisbursedValue)

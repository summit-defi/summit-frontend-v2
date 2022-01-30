/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'
import { FarmType, SummitEcosystemState } from '../types'
import { fetchElevationsData, fetchDeityDivider } from './fetchElevationInfo'
import { fetchRolloverReward } from './fetchRolloverRewardInNativeToken'
import { fetchSummitEnabled } from './fetchSummitEnabled'
import { fetchUsersTotems } from './fetchUsersTotems'

const getLocalStorageVariables = () => {
  const activeAccount = JSON.parse(localStorage.getItem('ActiveAccount'))
  return {
    activeAccount,
    summitEnabled: JSON.parse(localStorage.getItem('SummitEnabled')) || false,
    totems: elevationUtils.all.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        JSON.parse(localStorage.getItem(`${activeAccount}/${elevation}_totem`) || 'null'),
    ),
    winningTotems: elevationUtils.allWithExpedition.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        JSON.parse(localStorage.getItem(`${elevation}_winning_totem`) || 'null')
    ),
    totemSelectionRounds: elevationUtils.all.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        JSON.parse(localStorage.getItem(`${activeAccount}/${elevation}_totem_selection_round`)),
    ),
    chainId: JSON.parse(localStorage.getItem('ChainId')) || '97',
    farmType: (localStorage.getItem('FarmType') || FarmType.All) as FarmType,
  }
}

const initialState: SummitEcosystemState = {
  ...getLocalStorageVariables(),
  elevationsInfo: [],
  expeditionDivider: 50,
  liveFarms: true,
  pendingTxs: [],
  elevationRolloversToShow: [],
  rolloverRewardInNativeToken: new BigNumber(0),
  expeditionPotTotalValue: 0,
  pendingExpeditionTx: false,
  pendingTotemSelection: false,
}

export const SummitEcosystemSlice = createSlice({
  name: 'SummitEcosystem',
  initialState,
  reducers: {
    setActiveAccount: (state, action) => {
      state.activeAccount = action.payload
      localStorage.setItem('ActiveAccount', JSON.stringify(action.payload))
    },
    setSummitEnabled: (state, action) => {
      state.summitEnabled = action.payload
      localStorage.setItem('SummitEnabled', JSON.stringify(action.payload))
    },
    setDeityDivider: (state, action) => {
      const expeditionDivider = action.payload
      state.expeditionDivider = expeditionDivider
    },
    setElevationsData: (state, action) => {
      const elevationsData = action.payload
      state.elevationsInfo = elevationUtils.elevationExpedition.map((elevation) => {
        localStorage.setItem(`${elevation}_winning_totem`, `${elevationsData[elevation].winningTotem}`)
        state.winningTotems[elevationUtils.toInt(elevation)] = elevationsData[elevation].winningTotem
        return elevationsData[elevation]
      })
    },
    setTotemsData: (state, action) => {
      const totemsData = action.payload
      elevationUtils.all.forEach((elevation) => {
        state.totems[elevationUtils.toInt(elevation)] = totemsData[elevation].totem
        state.totemSelectionRounds[elevationUtils.toInt(elevation)] = totemsData[elevation].totemSelectionRound
        localStorage.setItem(`${state.activeAccount}/${elevation}_totem`, `${totemsData[elevation].totem}`)
        localStorage.setItem(`${state.activeAccount}/${elevation}_totem_selection_round`, `${totemsData[elevation].totemSelectionRound}`)
      })
    },
    updateElevationInfo: (state, action) => {
      const { elevation, elevationInfo } = action.payload
      state.elevationsInfo[elevationUtils.elevationToElevationDataIndex(elevation)] = elevationInfo
      state.winningTotems[elevationUtils.toInt(elevation)] = elevationInfo.winningTotem
      localStorage.setItem(`${elevation}_winning_totem`, `${elevationInfo.winningTotem}`)
    },
    updateElevationTotem: (state, action) => {
      const { elevation, totem } = action.payload
      localStorage.setItem(`${state.activeAccount}/${elevation}_totem`, `${totem}`)
      state.totems[elevationUtils.toInt(elevation)] = totem
    },
    setFarmType: (state, action) => {
      const farmType = action.payload
      state.farmType = farmType
      localStorage.setItem('FarmType', farmType)
    },
    setLiveFarms: (state, action) => {
      const live = action.payload
      state.liveFarms = live
    },
    addPendingTransaction: (state, action) => {
      const pendingTx = action.payload
      state.pendingTxs = [...state.pendingTxs, pendingTx]
    },
    removePendingTransaction: (state, action) => {
      const hash = action.payload
      state.pendingTxs = state.pendingTxs.filter((tx) => tx.hash !== hash)
    },
    addElevationRolloverToShow: (state, action) => {
      const elevation = action.payload
      state.elevationRolloversToShow = [...state.elevationRolloversToShow, elevation]
    },
    removeElevationRolloverToShow: (state, action) => {
      const elevation = action.payload
      state.elevationRolloversToShow = state.elevationRolloversToShow.filter((rollover) => rollover !== elevation)
    },
    setChainId: (state, action) => {
      state.chainId = action.payload
      localStorage.setItem('ChainId', action.payload)
    },
    setRolloverRewardInNativeToken: (state, action) => {
      state.rolloverRewardInNativeToken = action.payload
    },
    setExpeditionPot: (state, action) => {
      state.expeditionPotTotalValue = action.payload
    },
    setPendingExpeditionTx: (state, action) => {
      state.pendingExpeditionTx = action.payload
    },
    setPendingTotemSelection: (state, action) => {
      state.pendingTotemSelection = action.payload
    }
  },
})

// Actions
export const {
  setActiveAccount,
  setSummitEnabled,
  setDeityDivider,
  setChainId,
  setElevationsData,
  setTotemsData,
  updateElevationInfo,
  updateElevationTotem,
  setFarmType,
  setLiveFarms,
  addPendingTransaction,
  removePendingTransaction,
  addElevationRolloverToShow,
  removeElevationRolloverToShow,
  setRolloverRewardInNativeToken,
  setExpeditionPot,
  setPendingExpeditionTx,
  setPendingTotemSelection,
} = SummitEcosystemSlice.actions

// Thunks
export const fetchSummitEcosystemEnabledAsync = () => async (dispatch, getState) => {
  if (getState().summitEcosystem.summitEnabled) return
  const summitEnabled = await fetchSummitEnabled()
  if (summitEnabled == null) return
  dispatch(setSummitEnabled(summitEnabled))
}
export const fetchElevationsPublicDataAsync = () => async (dispatch) => {
  const elevationsInfo = await fetchElevationsData()
  if (elevationsInfo == null) return
  dispatch(setElevationsData(elevationsInfo))
}
export const fetchUserTotemsAsync = (account) => async (dispatch) => {
  const totems = await fetchUsersTotems(account)
  if (totems == null) return
  dispatch(setTotemsData(totems))
}
export const fetchElevationHelperInfoAsync = () => async (dispatch) => {
  const deityDivider = await fetchDeityDivider()
  if (deityDivider == null) return
  dispatch(setDeityDivider(deityDivider))
}
export const updateElevationInfoAsync = (elevation: Elevation) => async (dispatch) => {
  const elevationsInfo = await fetchElevationsData(elevation)
  if (elevationsInfo == null) return
  dispatch(updateElevationInfo({ elevation, elevationInfo: { ...elevationsInfo[elevation] } }))
}
export const updateFarmType = (farmType: FarmType) => async (dispatch) => {
  dispatch(setFarmType(farmType))
}
export const updateLiveFarms = (live: boolean) => async (dispatch) => {
  dispatch(setLiveFarms(live))
}
export const addPendingTx = (hash: string, title: string) => async (dispatch) => {
  dispatch(addPendingTransaction({ hash, title }))
}
export const removePendingTx = (hash: string) => async (dispatch) => {
  dispatch(removePendingTransaction(hash))
}
export const updateChainId = (chainId: string) => async (dispatch) => {
  dispatch(setChainId(chainId))
}
export const fetchRolloverRewardInNativeTokenAsync = () => async (dispatch) => {
  const rolloverRewardInNativeToken = await fetchRolloverReward()
  if (rolloverRewardInNativeToken == null) return
  dispatch(setRolloverRewardInNativeToken(rolloverRewardInNativeToken))
}
export const updatePendingTotemSelection = (pending) => async (dispatch) => {
  dispatch(setPendingTotemSelection(pending))
}

export default SummitEcosystemSlice.reducer

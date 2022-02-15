/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { BN_ZERO, Elevation, elevationUtils } from 'config/constants/types'
import { FarmType, SummitEcosystemState } from '../types'
import { fetchElevationsData, fetchDeityDivider } from './fetchElevationInfo'
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
    winningNumbersDrawn: elevationUtils.allWithExpedition.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        JSON.parse(localStorage.getItem(`${elevation}_winning_number_drawn`) || 'null')
    ),
    elevMarkedWinningRound: elevationUtils.allWithExpedition.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        JSON.parse(localStorage.getItem(`${elevation}_marked_winning_round`) || '0')
    ),
    totemSelectionRounds: elevationUtils.all.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        JSON.parse(localStorage.getItem(`${activeAccount}/${elevation}_totem_selection_round`)),
    ),
    chainId: JSON.parse(localStorage.getItem('ChainId')) || '97',
    farmType: (localStorage.getItem('FarmType') || FarmType.All) as FarmType,
    // elevationsInfo: [],
    elevationsInfo: elevationUtils.elevationExpedition.map((elev) => {
      return JSON.parse(localStorage.getItem(`${elev}_ecosystem_info`) || 'null')
    }),
    summitSwapMinimized: JSON.parse(localStorage.getItem('SummitSwapMinimized') || 'false'),
    expeditionAPR: parseFloat(JSON.parse(localStorage.getItem('ExpeditionAPR') || '0')),
  }
}

const initialState: SummitEcosystemState = {
  ...getLocalStorageVariables(),
  expeditionDivider: 50,
  liveFarms: true,
  pendingTxs: [],
  elevationRolloversToShow: [],
  rolloverRewardInNativeToken: BN_ZERO,
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
    clearActiveAccount: (state) => {
      state.activeAccount = null
      localStorage.setItem('ActiveAccount', JSON.stringify(undefined))
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
        const elevInt = elevationUtils.toInt(elevation)
        const {roundNumber} = elevationsData[elevation]

        localStorage.setItem(`${elevation}_winning_totem`, `${elevationsData[elevation].winningTotem}`)
        state.winningTotems[elevInt] = elevationsData[elevation].winningTotem
        localStorage.setItem(`${elevation}_winning_number_drawn`, `${elevationsData[elevation].winningNumberDrawn}`)
        state.winningNumbersDrawn[elevInt] = elevationsData[elevation].winningNumberDrawn
        localStorage.setItem(`${elevation}_ecosystem_info`, JSON.stringify(elevationsData[elevation], null, 2))

        if (
          (state.totems[elevInt] != null) &&
          (state.totems[elevInt] === elevationsData[elevation].winningTotem) &&
          (roundNumber > state.elevMarkedWinningRound[elevInt])
        ) {
          state.elevationRolloversToShow.push(elevation)
        }

        state.elevMarkedWinningRound[elevInt] = roundNumber
        localStorage.setItem(`${elevation}_marked_winning_round`, JSON.stringify(roundNumber, null, 2))

        return elevationsData[elevation]
      })
    },
    setTotemsData: (state, action) => {
      const totemsData = action.payload
      elevationUtils.allWithExpedition.forEach((elevation) => {
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
    clearElevationRolloversToShow: (state) => {
      state.elevationRolloversToShow = []
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
    },
    setSummitSwapMinimized: (state, action) => {
      state.summitSwapMinimized = action.payload
      localStorage.setItem('SummitSwapMinimized', JSON.stringify(action.payload))
    },
    setExpeditionApr: (state, action) => {
      state.expeditionAPR = action.payload
      localStorage.setItem('ExpeditionAPR', JSON.stringify(action.payload))
    }
  },
})

// Actions
export const {
  setActiveAccount,
  clearActiveAccount,
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
  clearElevationRolloversToShow,
  setRolloverRewardInNativeToken,
  setExpeditionPot,
  setPendingExpeditionTx,
  setSummitSwapMinimized,
  setPendingTotemSelection,
  setExpeditionApr,
} = SummitEcosystemSlice.actions

// Thunks
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
export const updatePendingTotemSelection = (pending) => async (dispatch) => {
  dispatch(setPendingTotemSelection(pending))
}
export const updateSummitSwapMinimized = (minimized) => async (dispatch) => {
  dispatch(setSummitSwapMinimized(minimized))
}

export default SummitEcosystemSlice.reducer

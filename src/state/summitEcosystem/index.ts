/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'
import { FarmType, SummitEcosystemState } from '../types'
import { fetchElevationsData, fetchElevationHelperPublicInfo } from './fetchElevationInfo'
import { fetchRolloverReward } from './fetchRolloverRewardInNativeToken'
import { fetchSummitEnabled } from './fetchSummitEnabled'
import { fetchUsersTotems } from './fetchUsersTotems'

const getLocalStorageVariables = () => {
  const activeAccount = JSON.parse(localStorage.getItem('ActiveAccount'))
  return {
    activeAccount,
    summitEnabled: JSON.parse(localStorage.getItem('SummitEnabled')) || false,
    totems: elevationUtils.all.map((elevation): number =>
      JSON.parse(localStorage.getItem(`${activeAccount}/${elevation}totem`)),
    ),
    totemsLockedIn: elevationUtils.all.map((elevation): boolean =>
      JSON.parse(localStorage.getItem(`${activeAccount}/${elevation}lockedin`)),
    ),
    chainId: JSON.parse(localStorage.getItem('ChainId')) || '97',
    farmType: (localStorage.getItem('FarmType') || FarmType.All) as FarmType,
  }
}

const initialState: SummitEcosystemState = {
  ...getLocalStorageVariables(),
  elevationsInfo: [],
  keywordRound: 0,
  expeditionDivider: 50,
  liveFarms: true,
  pendingTxs: [],
  elevationRolloversToShow: [],
  rolloverRewardInNativeToken: new BigNumber(0),
  expeditionPotTotalValue: 0,
  pendingExpeditionTx: false,
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
    setElevationHelperInfo: (state, action) => {
      const { keywordRound, expeditionDivider } = action.payload
      state.keywordRound = keywordRound
      state.expeditionDivider = expeditionDivider
    },
    setElevationsData: (state, action) => {
      const elevationsData = action.payload
      state.elevationsInfo = elevationUtils.elevationExpedition.map((elevation) => elevationsData[elevation])
    },
    setTotemsData: (state, action) => {
      const totemsData = action.payload
      elevationUtils.all.forEach((elevation) => {
        state.totems[elevationUtils.toInt(elevation)] = totemsData[elevation].totem
        localStorage.setItem(`${state.activeAccount}/${elevation}totem`, `${totemsData[elevation].totem}`)
      })

      elevationUtils.all.forEach((elevation) => {
        state.totemsLockedIn[elevationUtils.toInt(elevation)] = totemsData[elevation].totemSelected
        localStorage.setItem(`${state.activeAccount}/${elevation}lockedin`, `${totemsData[elevation].totemSelected}`)
      })
    },
    setElevationsInfo: (state, action) => {
      const elevationsInfo = action.payload
      state.elevationsInfo = elevationsInfo
    },
    updateElevationInfo: (state, action) => {
      const { elevation, elevationInfo } = action.payload
      state.elevationsInfo[elevationUtils.elevationToElevationDataIndex(elevation)] = {
        ...state.elevationsInfo[elevationUtils.elevationToElevationDataIndex(elevation)],
        ...elevationInfo,
      }
    },
    updateElevationTotem: (state, action) => {
      const { elevation, totem } = action.payload
      localStorage.setItem(`${state.activeAccount}/${elevation}totem`, `${totem}`)
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
    }
  },
})

// Actions
export const {
  setActiveAccount,
  setSummitEnabled,
  setElevationHelperInfo,
  setChainId,
  setElevationsData,
  setTotemsData,
  setElevationsInfo,
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
  const elevationHelperInfo = await fetchElevationHelperPublicInfo()
  if (elevationHelperInfo == null) return
  dispatch(setElevationHelperInfo(elevationHelperInfo))
}
export const updateUserTotemAsync = (elevation: Elevation, account: string) => async (dispatch) => {
  const totems = await fetchUsersTotems(account)
  if (totems == null) return
  dispatch(updateElevationInfo({ elevation, elevationInfo: { ...totems[elevation] } }))
}
export const updateElevationInfoAsync = (elevation: Elevation) => async (dispatch) => {
  const elevationsInfo = await fetchElevationsData()
  if (elevationsInfo == null) return
  dispatch(updateElevationInfo({ elevation, elevationInfo: { ...elevationsInfo[elevation] } }))
}
export const updateUserTotem = (elevation: Elevation, totem: number) => async (dispatch) => {
  dispatch(updateElevationTotem({ elevation, totem }))
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

export default SummitEcosystemSlice.reducer

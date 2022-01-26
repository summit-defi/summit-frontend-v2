/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { fetchExpeditionInfo } from './fetchExpeditionInfo'
import {
  fetchExpeditionPotentialWinnings,
  fetchExpeditionWinnings,
  fetchExpeditionUserData,
} from './fetchExpeditionUserInfo'
import { ExpeditionState } from '../types'
import BigNumber from 'bignumber.js'

const getUserLocalStorageVariables = () => {
  const activeAccount = JSON.parse(localStorage.getItem('ActiveAccount'))
  return {
    deity: JSON.parse(localStorage.getItem(`${activeAccount}/EXPEDITION_deity`)),
    conviction: JSON.parse(localStorage.getItem(`${activeAccount}/EXPEDITION_conviction`)),
    entered: JSON.parse(localStorage.getItem(`${activeAccount}/EXPEDITION_entered`)),
  }
}


const BN_ZERO = new BigNumber(0)
const emptyUserData = {
  everestOwned: BN_ZERO,

  deitySelectionRound: 0,
  ...getUserLocalStorageVariables(),

  summitLifetimeWinnings: BN_ZERO,
  usdcLifetimeWinnings: BN_ZERO,

  summitWinnings: BN_ZERO,
  usdcWinnings: BN_ZERO,

  guaranteedSummit: BN_ZERO,
  guaranteedUsdc: BN_ZERO,
  potentialSummitWinnings: BN_ZERO,
  potentialUsdcWinnings: BN_ZERO,
}

const emptyExpeditionTokenInfo = {
  roundEmission: BN_ZERO,
  emissionsRemaining: BN_ZERO,
  markedForDist: BN_ZERO,
  distributed: BN_ZERO,
}

const emptyExpedition = {
  live: false,
  launched: false,

  safeEverest: BN_ZERO,
  deitiedEverest: BN_ZERO,
  deityEverest: [BN_ZERO, BN_ZERO],

  summit: emptyExpeditionTokenInfo,
  usdc: emptyExpeditionTokenInfo,

  roundsRemaining: 0,
}

const initialState: ExpeditionState = {
  userData: emptyUserData,
  userDataLoaded: false,
  data: emptyExpedition,
  expeditionLoaded: false,
}

export const ExpeditionSlice = createSlice({
  name: 'Expedition',
  initialState,
  reducers: {
    setExpeditionPublicData: (state, action) => {
      state.data = action.payload
      state.expeditionLoaded = true
    },
    setExpeditionUserData: (state, action) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
      }
      state.userDataLoaded = true
      const activeAccount = JSON.parse(localStorage.getItem('ActiveAccount'))
      localStorage.setItem(`${activeAccount}/EXPEDITION_deity`, action.payload.deity)
      localStorage.setItem(`${activeAccount}/EXPEDITION_conviction`, action.payload.conviction)
      localStorage.setItem(`${activeAccount}/EXPEDITION_entered`, action.payload.entered)
    },
    updateExpeditionUserWinnings: (state, action) => {
      const { summitWinnings, usdcWinnings } = action.payload
      state.userData.summitWinnings = summitWinnings
      state.userData.usdcWinnings = usdcWinnings
    },
    updateExpeditionUserPotentialWinnings: (state, action) => {
      const { guaranteedSummit, guaranteedUsdc, potentialSummitWinnings, potentialUsdcWinnings } = action.payload
      state.userData.guaranteedSummit = guaranteedSummit
      state.userData.guaranteedUsdc = guaranteedUsdc
      state.userData.potentialSummitWinnings = potentialSummitWinnings
      state.userData.potentialUsdcWinnings = potentialUsdcWinnings
    },
  },
})

// Actions
export const {
  setExpeditionPublicData,
  setExpeditionUserData,
  updateExpeditionUserWinnings,
  updateExpeditionUserPotentialWinnings,
} = ExpeditionSlice.actions

// Thunks
export const fetchExpeditionPublicDataAsync = () => async (dispatch) => {
  const expeditionInfo = await fetchExpeditionInfo()
  if (expeditionInfo == null) return
  dispatch(setExpeditionPublicData(expeditionInfo))
}

export const fetchExpeditionUserDataAsync = (account) => async (dispatch) => {
  const userData = await fetchExpeditionUserData(account)
  if (userData == null) return
  dispatch(setExpeditionUserData(userData))
}

export const updateExpeditionUserWinningsAsync = (account: string) => async (dispatch) => {
  const winnings = await fetchExpeditionWinnings(account)
  if (winnings == null) return
  dispatch(updateExpeditionUserWinnings(winnings))
}

export const updateExpeditionUserPotentialWinningsAsync = (account: string) => async (dispatch) => {
  const potentialWinnings = await fetchExpeditionPotentialWinnings(account)
  if (potentialWinnings == null) return
  dispatch(updateExpeditionUserPotentialWinnings(potentialWinnings))
}

export default ExpeditionSlice.reducer

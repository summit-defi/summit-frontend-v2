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


const BN_ZERO = new BigNumber(0)
const emptyUserData = {
  everestStaked: BN_ZERO,

  deity: 0,
  deitySelected: false,
  deitySelectionRound: 0,
  safetyFactor: 0,
  safetyFactorSelected: false,

  entered: false,

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
  data: emptyExpedition
}

export const ExpeditionsSlice = createSlice({
  name: 'Expeditions',
  initialState,
  reducers: {
    setExpeditionPublicData: (state, action) => {
      state.data = action.payload
    },
    setExpeditionsUserData: (state, action) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
      }
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
  setExpeditionsUserData,
  updateExpeditionUserWinnings,
  updateExpeditionUserPotentialWinnings,
} = ExpeditionsSlice.actions

// Thunks
export const fetchExpeditionPublicDataAsync = () => async (dispatch) => {
  const expeditionInfo = await fetchExpeditionInfo()
  if (expeditionInfo == null) return
  dispatch(setExpeditionPublicData(expeditionInfo))
}

export const fetchExpeditionUserDataAsync = (account) => async (dispatch) => {
  const userData = await fetchExpeditionUserData(account)
  dispatch(setExpeditionsUserData(userData))
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

export default ExpeditionsSlice.reducer

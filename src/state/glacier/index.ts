/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { BN_ZERO } from 'config/constants'
import { GlacierState } from 'state/types'
import { epochDuration } from 'utils'
import { fetchUserEpochs } from './fetchUserEpochs'

const initialState: GlacierState = {
  lifetimeSummitWinnings: BN_ZERO,
  lifetimeSummitBonuses: BN_ZERO,
  epochs: [],
  currentEpochIndex: Math.floor(Date.now() / epochDuration),
  totalFrozenSummit: BN_ZERO,
  totalThawedSummit: BN_ZERO,
}

export const GlacierSlice = createSlice({
  name: 'Glacier',
  initialState,
  reducers: {
    setEpochs: (state, action) => {
      state.lifetimeSummitWinnings = action.payload.lifetimeSummitWinnings
      state.lifetimeSummitBonuses = action.payload.lifetimeSummitBonuses
      state.epochs = action.payload.epochs
      state.currentEpochIndex = action.payload.currentEpochIndex
      state.totalFrozenSummit = action.payload.totalFrozenSummit
      state.totalThawedSummit = action.payload.totalThawedSummit
    },
  },
})

// Actions
export const { setEpochs } = GlacierSlice.actions

// Thunks
export const fetchUserEpochsAsync = (account) => async (dispatch) => {
  const epochsData = await fetchUserEpochs(account)
  dispatch(setEpochs(epochsData))
}

export default GlacierSlice.reducer

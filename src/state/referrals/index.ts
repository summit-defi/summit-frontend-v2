/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { ZEROADD } from 'config/constants/types'
import { ReferralsState } from '../types'
import { fetchReferralsData } from './fetchReferralsData'

const initialState: ReferralsState = {
  referrer: ZEROADD,
  pendingRewards: 0,
  accumulatedRewards: 0,
  rewardsToBeBurned: 0,
}

export const ReferralsSlice = createSlice({
  name: 'Referrals',
  initialState,
  reducers: {
    setReferralsData: (state, action) => {
      const data = action.payload
      state.referrer = data.referrer
      state.pendingRewards = data.pendingRewards
      state.accumulatedRewards = data.accumulatedRewards
      state.rewardsToBeBurned = data.rewardsToBeBurned
    },
  },
})

// Actions
export const { setReferralsData } = ReferralsSlice.actions

// Thunks
export const fetchReferralsDataAsync = (account) => async (dispatch) => {
  const referralsData = await fetchReferralsData(account)
  if (referralsData == null) return
  dispatch(setReferralsData(referralsData))
}

export default ReferralsSlice.reducer

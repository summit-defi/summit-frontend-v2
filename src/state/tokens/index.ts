/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { getFarmTokens } from 'config/constants'
import { sum } from 'lodash'
import { TokensState } from 'state/types'
import { parseJSON } from 'utils'
import { fetchTokensUserData } from './fetchTokensData'

const getAvgStakingLoyaltyDuration = () => {
  const localStorageAvg = localStorage.getItem('AvgStakingLoyaltyDuration')
  if (localStorageAvg == null || isNaN(parseFloat(localStorageAvg))) return 0
  return parseJSON(localStorageAvg, 0)
}

const initialState: TokensState = {
  data: getFarmTokens(),
  avgStakingLoyaltyDuration: getAvgStakingLoyaltyDuration(),
}

export const TokensSlice = createSlice({
  name: 'Tokens',
  initialState,
  reducers: {
    setTokensUserData: (state, action) => {
      const { tokensUserData, avgStakingLoyaltyDuration } = action.payload
      state.data = state.data.map((token) => ({
        ...token,
        ...tokensUserData[token.symbol]
      }))
      state.avgStakingLoyaltyDuration = avgStakingLoyaltyDuration
      localStorage.setItem('AvgStakingLoyaltyDuration', avgStakingLoyaltyDuration)
    },
  },
})

// Actions
export const { setTokensUserData } = TokensSlice.actions

// Thunks
export const fetchTokensUserDataAsync = (account) => async (dispatch) => {
  const tokensUserData = await fetchTokensUserData(account)

  const currentTimestamp = Math.floor(Date.now() / 1000)
  
  const bonusResetTimestamps = Object.values(tokensUserData)
    .filter((tokenData) => tokenData.bonusResetTimestamp !== 0)
    .map((tokenData) => (currentTimestamp - tokenData.bonusResetTimestamp))

  const avgStakingLoyaltyDuration = bonusResetTimestamps.length === 0 ?
    0 :
    sum(bonusResetTimestamps) / bonusResetTimestamps.length
  dispatch(setTokensUserData({tokensUserData, avgStakingLoyaltyDuration}))
}

export default TokensSlice.reducer

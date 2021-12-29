/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { getFarmTokens } from 'config/constants'
import { TokensState } from 'state/types'
import { fetchTokensUserData } from './fetchTokensData'

const initialState: TokensState = {
  data: getFarmTokens()
}

export const TokensSlice = createSlice({
  name: 'Tokens',
  initialState,
  reducers: {
    setTokensUserData: (state, action) => {
      state.data = state.data.map((token) => ({
        ...token,
        ...action.payload[token.symbol]
      }))
    },
  },
})

// Actions
export const { setTokensUserData } = TokensSlice.actions

// Thunks
export const fetchTokensUserDataAsync = (account) => async (dispatch) => {
  const tokensUserData = await fetchTokensUserData(account)
  dispatch(setTokensUserData(tokensUserData))
}

export default TokensSlice.reducer

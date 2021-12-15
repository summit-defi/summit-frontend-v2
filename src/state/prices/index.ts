/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { PriceState } from 'state/types'
import { fetchPricesV2 } from './fetchPricesV2'

const initialState: PriceState = {}

export const PricesSlice = createSlice({
  name: 'Prices',
  initialState,
  reducers: {
    setPricesPerToken: (state, action) => {
      state.pricesPerToken = action.payload
    },
  },
})

// Actions
export const { setPricesPerToken } = PricesSlice.actions

// Thunks
export const fetchPricesAsync = () => async (dispatch) => {
  const pricesPerToken = await fetchPricesV2()
  if (pricesPerToken == null) return
  dispatch(setPricesPerToken(pricesPerToken))
}

export default PricesSlice.reducer

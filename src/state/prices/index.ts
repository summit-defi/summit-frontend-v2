/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { PriceState } from 'state/types'
import { mapValues, parseJSON } from 'utils'
import { fetchPricesV2 } from './fetchPricesV2'

const getLocalStoragePrices = () => {
  const localStoragePrices = localStorage.getItem('PricesPerToken')
  if (localStoragePrices == null || localStoragePrices === 'null' || localStoragePrices === 'undefined' || localStoragePrices === '{}') return { pricesPerToken: {} }
  const pricesPerToken = mapValues<string, BigNumber, boolean>(
    parseJSON(localStorage.getItem('PricesPerToken'), {}),
    (price) => new BigNumber(price),
  ) as unknown as { [key: string]: BigNumber }
  return { pricesPerToken }
}

const initialState: PriceState = {
  ...getLocalStoragePrices()
}

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
  localStorage.setItem('PricesPerToken', JSON.stringify(pricesPerToken))
  dispatch(setPricesPerToken(pricesPerToken))
}

export default PricesSlice.reducer

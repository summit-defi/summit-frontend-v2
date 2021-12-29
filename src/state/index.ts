import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import expeditionsReducer from './expeditions'
import summitEcosystemReducer from './summitEcosystem'
import pricesReducer from './prices'
import tokensReducer from './tokens'

export default configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    expeditions: expeditionsReducer,
    summitEcosystem: summitEcosystemReducer,
    prices: pricesReducer,
    tokens: tokensReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
})

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import expeditionsReducer from './expeditions'
import summitEcosystemReducer from './summitEcosystem'
import pricesReducer from './prices'
import tokensReducer from './tokens'
import glacierReducer from './glacier'
import everestReducer from './everest'

export default configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    expeditions: expeditionsReducer,
    summitEcosystem: summitEcosystemReducer,
    prices: pricesReducer,
    tokens: tokensReducer,
    glacier: glacierReducer,
    everest: everestReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
})

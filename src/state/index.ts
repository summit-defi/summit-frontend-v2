import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import expeditionsReducer from './expeditions'
import summitEcosystemReducer from './summitEcosystem'
import pricesReducer from './prices'
import blockReducer from './block'
import referralsReducer from './referrals'

export default configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    expeditions: expeditionsReducer,
    summitEcosystem: summitEcosystemReducer,
    referrals: referralsReducer,
    prices: pricesReducer,
    block: blockReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
})

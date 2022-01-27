import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { stateToExpeditionUserDataLoaded, stateToExpeditionLoaded } from './base'

const selectExpeditionLoaded = createSelector(
    stateToExpeditionLoaded,
    stateToExpeditionUserDataLoaded,
    (expeditionLoaded, userDataLoaded) => ({
        expeditionLoaded,
        userDataLoaded
    })
)
export const useExpeditionLoaded = () => useSelector(selectExpeditionLoaded)
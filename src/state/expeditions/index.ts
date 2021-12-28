/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { fetchExpeditions } from './fetchExpeditions'
import {
  fetchExpeditionUserAllowanceAndBalance,
  fetchExpeditionStakedBalances,
  fetchExpeditionEarnedRewards,
  fetchExpeditionHypotheticalRewards,
} from './fetchExpeditionsUsers'
import { ExpeditionState, Expedition, ExpeditionUserData } from '../types'
import BigNumber from 'bignumber.js'
import { groupByAndMap } from 'utils'
import { getExpeditionConfigs } from 'config/constants'

const initialState: ExpeditionState = {
  data: [...getExpeditionConfigs()],
  summitAllowance: new BigNumber(0),
  summitBalance: new BigNumber(0),
  summitLpAllowance: new BigNumber(0),
  summitLpBalance: new BigNumber(0),
}

export const ExpeditionsSlice = createSlice({
  name: 'Expeditions',
  initialState,
  reducers: {
    setExpeditionsPublicData: (state, action) => {
      const liveExpeditionsData: Expedition[] = action.payload
      state.data = state.data.map((expedition) => {
        return { ...expedition, ...liveExpeditionsData[expedition.pid] }
      })
    },
    setExpeditionsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((expedition) => ({
        ...expedition,
        userData: userData[expedition.pid],
      }))
    },
    setExpeditionUserAllowanceAndBalance: (state, action) => {
      const { summitAllowance, summitBalance, summitLpAllowance, summitLpBalance } = action.payload
      state.summitAllowance = summitAllowance
      state.summitBalance = summitBalance
      state.summitLpAllowance = summitLpAllowance
      state.summitLpBalance = summitLpBalance
    },
    updateExpeditionsUserData: (state, action) => {
      const { field, value, pid } = action.payload
      const index = state.data.findIndex((p) => p.pid === pid)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const {
  setExpeditionsPublicData,
  setExpeditionsUserData,
  setExpeditionUserAllowanceAndBalance,
  updateExpeditionsUserData,
} = ExpeditionsSlice.actions

// Thunks
export const fetchExpeditionsPublicDataAsync = () => async (dispatch) => {
  const expeditionsData = await fetchExpeditions()
  if (expeditionsData == null) return
  dispatch(setExpeditionsPublicData(expeditionsData))
}

export const fetchExpeditionUserDataAsync = (account) => async (dispatch) => {
  const expeditionConfigs = getExpeditionConfigs()
  const allowancesAndBalances = await fetchExpeditionUserAllowanceAndBalance(account)
  const stakedBalances = await fetchExpeditionStakedBalances(account, expeditionConfigs)
  const pendingRewards = await fetchExpeditionEarnedRewards(account, expeditionConfigs)
  const hypotheticalRewards = await fetchExpeditionHypotheticalRewards(account, expeditionConfigs)

  if (
    expeditionConfigs == null ||
    allowancesAndBalances == null ||
    stakedBalances == null ||
    pendingRewards == null ||
    hypotheticalRewards == null
  )
    return

  const userData = groupByAndMap(
    expeditionConfigs,
    (expedition) => expedition.pid,
    (expedition): ExpeditionUserData => ({
      ...stakedBalances[expedition.pid],
      earnedReward: pendingRewards[expedition.pid],
      ...hypotheticalRewards[expedition.pid],
    }),
  )

  dispatch(setExpeditionsUserData(userData))
  dispatch(setExpeditionUserAllowanceAndBalance(allowancesAndBalances))
}

export const updateExpeditionUserAllowanceAndBalance = (pid: string, account: string) => async (dispatch) => {
  const allowancesAndBalances = await fetchExpeditionUserAllowanceAndBalance(account)
  if (allowancesAndBalances == null) return
  dispatch(setExpeditionUserAllowanceAndBalance(allowancesAndBalances))
}

export const updateUserStakedBalances = (pid: string, account: string) => async (dispatch) => {
  const expeditionConfigs = getExpeditionConfigs()
  const stakedBalances = await fetchExpeditionStakedBalances(account, expeditionConfigs)
  if (stakedBalances == null) return
  dispatch(updateExpeditionsUserData({ pid, field: 'stakedSummit', value: stakedBalances[pid].stakedSummit }))
  dispatch(updateExpeditionsUserData({ pid, field: 'stakedSummitLp', value: stakedBalances[pid].stakedSummitLp }))
}

export const updateUserPendingReward = (pid: string, account: string) => async (dispatch) => {
  const expeditionConfigs = getExpeditionConfigs()
  const pendingRewards = await fetchExpeditionEarnedRewards(account, expeditionConfigs)
  if (pendingRewards == null) return
  dispatch(updateExpeditionsUserData({ pid, field: 'earnedReward', value: pendingRewards[pid] }))
}

export default ExpeditionsSlice.reducer

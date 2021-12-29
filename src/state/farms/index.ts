/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { getFarmConfigs } from 'config/constants/farms'
import { fetchFarms } from './fetchFarms'
import {
  fetchPoolClaimableRewards,
  fetchFarmUserStakedBalances,
  fetchElevationsRoundRewards,
  fetchElevClaimableRewards,
  fetchElevPotentialWinnings,
  fetchPoolYieldContributed,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'
import { groupByAndMap } from 'utils'
import BigNumber from 'bignumber.js'
import { BN_ZERO, elevationUtils } from 'config/constants/types'
import { farmId } from 'utils/farmId'

const EMPTY_ELEVATION_FARMS_DATA = {
  claimable: BN_ZERO,
  yieldContributed: BN_ZERO,
  potentialWinnings: BN_ZERO,
  roundRewards: BN_ZERO,
  totemRoundRewards: [],
}

const initialState: FarmsState = {
  farmsLoaded: false,
  userDataLoaded: false,
  elevationDataLoaded: false,
  data: [...getFarmConfigs()],
  elevationData: [
    EMPTY_ELEVATION_FARMS_DATA,
    EMPTY_ELEVATION_FARMS_DATA,
    EMPTY_ELEVATION_FARMS_DATA,
    EMPTY_ELEVATION_FARMS_DATA,
  ],
}

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload
      state.data = state.data.map((farm) => ({
        ...farm,
        ...liveFarmsData[farmId(farm)]
      }))
      state.farmsLoaded = true
    },
    setFarmUserData: (state, action) => {
      const { farmsUserData } = action.payload
      state.data = state.data.map((farm) => ({
        ...farm,
        userData: farmsUserData[farmId(farm)],
      }))
      state.userDataLoaded = true
    },
    setElevationFarmsData: (state, action) => {
      const { elevClaimableRewards, elevPotentialWinnings, elevRoundRewards } = action.payload
      state.elevationData = elevationUtils.all.map((elevation) => ({
        claimable: elevClaimableRewards[elevation] as BigNumber,
        yieldContributed: elevPotentialWinnings[elevation].yieldContributed as BigNumber,
        potentialWinnings: elevPotentialWinnings[elevation].potentialWinnings as BigNumber,
        roundRewards: elevRoundRewards[elevation].roundRewards as BigNumber,
        totemRoundRewards: elevRoundRewards[elevation].totemRoundRewards as BigNumber[],
      }))
      state.elevationDataLoaded = true
    },
  },
})

// Actions
export const { setFarmsPublicData, setFarmUserData, setElevationFarmsData } = farmsSlice.actions

// Thunks
export const fetchFarmsPublicDataAsync = () => async (dispatch) => {
  const farmsInfo = await fetchFarms()
  dispatch(setFarmsPublicData(farmsInfo))
}
export const fetchFarmUserDataAsync = (account) => async (dispatch) => {
  const farmConfigs = getFarmConfigs()

  const [
    stakedBalances,
    poolClaimableRewards,
    poolYieldContributed,
    elevClaimableRewards,
    elevPotentialWinnings,
    elevRoundRewards,
  ] = await Promise.all([
    await fetchFarmUserStakedBalances(account, farmConfigs),
    await fetchPoolClaimableRewards(account, farmConfigs),
    await fetchPoolYieldContributed(account, farmConfigs),
    await fetchElevClaimableRewards(account),
    await fetchElevPotentialWinnings(account),
    await fetchElevationsRoundRewards(farmConfigs),
  ])

  const farmsUserData = groupByAndMap(
    farmConfigs,
    (farm) => farmId(farm),
    (farm) => {
      const id = farmId(farm)
      return {
        stakedBalance: stakedBalances[id] || BN_ZERO,
        claimable: poolClaimableRewards[id] || BN_ZERO,
        yieldContributed: poolYieldContributed[id] || BN_ZERO,
      }
    },
  )

  dispatch(setFarmUserData({ farmsUserData }))
  dispatch(
    setElevationFarmsData({ elevClaimableRewards, elevPotentialWinnings, elevRoundRewards }),
  )
}

export default farmsSlice.reducer

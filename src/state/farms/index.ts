/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { getFarmConfigs } from 'config/constants/farms'
import { fetchFarms } from './fetchFarms'
import {
  fetchFarmEarnedAndVestingRewards,
  fetchFarmUserAllowances,
  fetchFarmUserBalances,
  fetchFarmRoundYieldContributed,
  fetchFarmUserStakedBalances,
  fetchElevationsRoundRewards,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'
import { groupByAndMap } from 'utils'
import BigNumber from 'bignumber.js'
import { Elevation } from 'config/constants/types'

const BN_ZERO = new BigNumber(0)
const EMPTY_ELEVATION_FARMS_DATA = {
  userEarned: BN_ZERO,
  userVesting: BN_ZERO,
  userYieldContributed: BN_ZERO,
  roundRewards: BN_ZERO,
  totemsRoundRewards: [],
}

const initialState: FarmsState = {
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
      state.data = state.data.map((farm) => {
        return { ...farm, ...liveFarmsData[farm.pid] }
      })
    },
    setFarmUserData: (state, action) => {
      const { farmsUserData } = action.payload
      state.data = state.data.map((farm) => {
        return {
          ...farm,
          userData: farmsUserData[farm.pid],
        }
      })
    },
    setElevationFarmsData: (state, action) => {
      const { elevationEarnedAndVesting, elevationTotemRoundRewards, elevationRoundYieldContributed } = action.payload
      state.elevationData = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT].map((elevation) => ({
        userEarned: elevationEarnedAndVesting[elevation].earned as BigNumber,
        userVesting: elevationEarnedAndVesting[elevation].vesting as BigNumber,
        userYieldContributed: elevationRoundYieldContributed[elevation] as BigNumber,
        roundRewards: elevationTotemRoundRewards[elevation].roundRewards as BigNumber,
        totemsRoundRewards: elevationTotemRoundRewards[elevation].totemRoundRewards as BigNumber[],
      }))
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
    allowances,
    tokenBalances,
    stakedBalances,
    earnedAndVesting,
    elevationTotemRoundRewards,
    yieldContributed,
  ] = await Promise.all([
    await fetchFarmUserAllowances(account, farmConfigs),
    await fetchFarmUserBalances(account, farmConfigs),
    await fetchFarmUserStakedBalances(account, farmConfigs),
    await fetchFarmEarnedAndVestingRewards(account, farmConfigs),
    await fetchElevationsRoundRewards(farmConfigs),
    await fetchFarmRoundYieldContributed(account, farmConfigs),
  ])

  if (
    allowances == null ||
    tokenBalances == null ||
    stakedBalances == null ||
    earnedAndVesting == null ||
    elevationTotemRoundRewards == null ||
    yieldContributed == null
  )
    return

  const { farmEarnedAndVesting, elevationEarnedAndVesting } = earnedAndVesting
  const { roundYieldContributed, elevationRoundYieldContributed } = yieldContributed

  const farmsUserData = groupByAndMap(
    farmConfigs,
    (farm) => farm.pid,
    (farm) => ({
      allowance: allowances[farm.pid],
      tokenBalance: tokenBalances[farm.pid],
      stakedBalance: stakedBalances[farm.pid],
      earnedReward: farmEarnedAndVesting[farm.pid].earned,
      vestingReward: farmEarnedAndVesting[farm.pid].vesting,
      roundYieldContributed: roundYieldContributed[farm.pid],
    }),
  )

  dispatch(setFarmUserData({ farmsUserData }))
  dispatch(
    setElevationFarmsData({ elevationEarnedAndVesting, elevationTotemRoundRewards, elevationRoundYieldContributed }),
  )
}

export default farmsSlice.reducer

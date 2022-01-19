import React from 'react'
import { Elevation, ElevationFarmTab, elevationTabToElevation, elevationUtils } from 'config/constants/types'
import styled, { css } from 'styled-components'
import { elevationPalette } from 'theme/colors'
import { chunkArray, getBalanceNumber, getFormattedBigNumber, getFullDisplayBalance, groupByAndMap } from 'utils'
import { Text, Flex } from 'uikit'
import Totem from './Totem'
import chroma from 'chroma-js'
import BigNumber from 'bignumber.js'
import { clamp, orderBy } from 'lodash'
import { useClaimElevation } from 'hooks/useClaim'
import { useSelectedElevation, useIsElevationLockedUntilRollover, useElevationUserRoundInfo, useFarms, useElevationTotem, useElevationFarmsTab } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import SummitButton from 'uikit/components/Button/SummitButton'
import TotemBattleBreakdown from './TotemBattleBreakdown'

const AllElevationsTotemBattles: React.FC = () => {
  return null
}

const SingleElevationTotemBattle: React.FC<{ elevationTab: ElevationFarmTab }> = ({ elevationTab }) => {
  const elevation = elevationTabToElevation[elevationTab]
  const { totemMultipliers } = useElevationUserRoundInfo(elevation)
  const userTotem = useElevationTotem(elevation)

  const totemInfos = elevationUtils.totemsArray(elevation).map((totem) => ({
    totem,
    mult: totemMultipliers[totem],
  }))

  if (elevation === Elevation.OASIS) return null

  return (
    <TotemBattleBreakdown
      // title={`${elevation} TOTEM BATTLE`}
      elevation={elevation}
      totemInfos={totemInfos}
      userTotem={userTotem}
    />
  )
}

const ElevationTotemBattle: React.FC = () => {
  const elevationTab = useElevationFarmsTab()

  if (elevationTab === ElevationFarmTab.DASH) return (
    <AllElevationsTotemBattles/>
  ) 

  return (
    <SingleElevationTotemBattle elevationTab={elevationTab}/>
  )
  
}

export default React.memo(ElevationTotemBattle)

import React from 'react'
import { Elevation, elevationUtils } from 'config/constants/types'
import styled, { css } from 'styled-components'
import { elevationPalette } from 'theme/colors'
import { chunkArray, getBalanceNumber, getFormattedBigNumber, getFullDisplayBalance, groupByAndMap } from 'utils'
import { Text, Flex } from 'uikit'
import Totem from './Totem'
import chroma from 'chroma-js'
import BigNumber from 'bignumber.js'
import { clamp, orderBy } from 'lodash'
import { useClaimElevation } from 'hooks/useClaim'
import { useSelectedElevation, useIsElevationLockedUntilRollover, useElevationUserRoundInfo, useFarms, useElevationTotem } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import SummitButton from 'uikit/components/Button/SummitButton'
import TotemBattleBreakdown from './TotemBattleBreakdown'

const ElevationTotemBattle: React.FC = () => {
  const elevation = useSelectedElevation()
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

export default React.memo(ElevationTotemBattle)

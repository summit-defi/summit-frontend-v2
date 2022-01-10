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
import { useSelectedElevation, useIsElevationLockedUntilRollover, useElevationUserRoundInfo, useFarms } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import SummitButton from 'uikit/components/Button/SummitButton'

const ElevationWinnings: React.FC = () => {
  const elevation = useSelectedElevation()
  const elevationLocked = useIsElevationLockedUntilRollover()
  const { claimable, yieldContributed, potentialWinnings, roundRewards, totemRoundRewards } = useElevationUserRoundInfo(elevation)
  const rawClaimable = getBalanceNumber(claimable)
  const farms = useFarms()
  const earningsOrWinnings = elevationUtils.winningsOrEarnings(elevation).toUpperCase()

  // CLAIMING ELEVATION
  const { onClaimElevation, claimPending } = useClaimElevation(elevation)
  const nothingToClaim = !claimable || claimable.isEqualTo(0)

  const farmsWithClaimable = farms
    .map((farm) => ({
      symbol: farm.symbol,
      claimable: farm.elevations[elevation]?.claimable || new BigNumber(0)
    }))
    .filter((farm) => farm.claimable.isGreaterThan(0))

  const sortedClaimables = orderBy(
    farmsWithClaimable,
    (farmWithClaimable) => farmWithClaimable.claimable.toNumber(),
    'desc'
  )

  const contributionSum = sortedClaimables.reduce((acc, sortedClaimable) => acc.plus(sortedClaimable.claimable), new BigNumber(0))

  const contributions = sortedClaimables.map((sortedClaimable, index) => ({
    token: true,
    title: sortedClaimable.symbol,
    key: index,
    perc: sortedClaimable.claimable.times(100).div(contributionSum).toNumber(),
    val: `${getFormattedBigNumber(sortedClaimable.claimable)} SUMMIT`,
  }))


  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex alignItems='center' mb='12px' justifyContent='space-around' width='100%' maxWidth='400px'>
        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <Text bold monospace>{elevation} {earningsOrWinnings}:</Text>
          <CardValue
            value={rawClaimable}
            decimals={3}
            elevation={elevation}
            fontSize="18px"
            postfix='SUMMIT'
            postfixFontSize='14px'
          />
        </Flex>
        <SummitButton
          elevation={elevation}
          isLocked={elevationLocked}
          isLoading={claimPending}
          disabled={nothingToClaim}
          width='200px'
          onClick={() => onClaimElevation()}
        >
          CLAIM {elevation}
          <br />
          {earningsOrWinnings}
        </SummitButton>
      </Flex>

      <ContributionBreakdown
        title={`${earningsOrWinnings} BY FARM:`}
        contributions={contributions}
      />
      
      

    </Flex>
  )
}

export default React.memo(ElevationWinnings)

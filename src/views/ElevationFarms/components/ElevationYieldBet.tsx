import React from 'react'
import { getBalanceNumber, getFormattedBigNumber } from 'utils'
import { Text, Flex } from 'uikit'
import BigNumber from 'bignumber.js'
import { orderBy } from 'lodash'
import { useSelectedElevation, useElevationUserRoundInfo, useFarms } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'

const ElevationYieldBet: React.FC = () => {
  const elevation = useSelectedElevation()
  const { yieldContributed, potentialWinnings } = useElevationUserRoundInfo(elevation)
  const rawYieldContributed = getBalanceNumber(yieldContributed)
  const rawPotentialWinnings = getBalanceNumber(potentialWinnings)
  const farms = useFarms()

  const farmsWithYield = farms
    .map((farm) => ({
      symbol: farm.symbol,
      yieldContributed: farm.elevations[elevation]?.yieldContributed || new BigNumber(0)
    }))
    .filter((farm) => farm.yieldContributed.isGreaterThan(0))

  const sortedYields = orderBy(
    farmsWithYield,
    (farmWithYield) => farmWithYield.yieldContributed.toNumber(),
    'desc'
  )

  const contributionSum = sortedYields.reduce((acc, sortedYield) => acc.plus(sortedYield.yieldContributed), new BigNumber(0))

  const contributions = sortedYields.map((sortedYield, index) => ({
    token: true,
    title: sortedYield.symbol,
    key: index,
    perc: sortedYield.yieldContributed.times(100).div(contributionSum).toNumber(),
    val: `${getFormattedBigNumber(sortedYield.yieldContributed)} SUMMIT`,
  }))


  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex alignItems='center' mb='12px' justifyContent='space-around' width='100%' maxWidth='400px'>
        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <Text bold monospace>YIELD BET:</Text>
          <CardValue
            value={rawYieldContributed}
            decimals={3}
            summitPalette={elevation}
            fontSize="18"
            postfix='SUMMIT'
            postfixFontSize='14'
          />
        </Flex>
        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <Text bold monospace>POTENTIAL WINNINGS:</Text>
          <CardValue
            value={rawPotentialWinnings}
            decimals={3}
            summitPalette={elevation}
            fontSize="18"
            postfix='SUMMIT'
            postfixFontSize='14'
          />
        </Flex>
      </Flex>

      <ContributionBreakdown
        title='YIELD BET BY FARM:'
        contributions={contributions}
      />
    </Flex>
  )
}

export default React.memo(ElevationYieldBet)

import React from 'react'
import { getBalanceNumber } from 'utils'
import { Text, Flex } from 'uikit'
import { useSelectedElevation } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import { useElevationYieldBetContributions, useUserElevationYieldInfo } from 'state/hooksNew'

const ElevationYieldBet: React.FC = () => {
  const elevation = useSelectedElevation()
  const yieldBetContributions = useElevationYieldBetContributions(elevation)
  const { yieldContributed, potentialWinnings } = useUserElevationYieldInfo(elevation)
  const rawYieldContributed = getBalanceNumber(yieldContributed)
  const rawPotentialWinnings = getBalanceNumber(potentialWinnings)

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
        contributions={yieldBetContributions}
      />
    </Flex>
  )
}

export default React.memo(ElevationYieldBet)

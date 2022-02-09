import React from 'react'
import { getBalanceNumber } from 'utils'
import { Text, Flex, Skeleton } from 'uikit'
import { useSelectedElevation } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import { useElevationYieldBetContributions, useUserElevationYieldInfo, useFarmsUserDataLoaded } from 'state/hooksNew'

const ElevationYieldBet: React.FC = () => {
  const elevation = useSelectedElevation()
  const userDataLoaded = useFarmsUserDataLoaded()
  const yieldBetContributions = useElevationYieldBetContributions(elevation)
  const { yieldContributed, potentialWinnings } = useUserElevationYieldInfo(elevation)
  const rawYieldContributed = getBalanceNumber(yieldContributed)
  const rawPotentialWinnings = getBalanceNumber(potentialWinnings)

  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex alignItems='center' mb='12px' justifyContent='space-around' width='100%' maxWidth='400px'>
        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <Text bold monospace>YIELD BET:</Text>
          { userDataLoaded ?
            <CardValue
              value={rawYieldContributed}
              decimals={3}
              summitPalette={elevation}
              fontSize="18"
              postfix='SUMMIT'
              postfixFontSize='14'
            /> :
            <Skeleton height={24} width={180}/>
          }
        </Flex>
        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <Text bold monospace>POTENTIAL WINNINGS:</Text>
          { userDataLoaded ?
            <CardValue
              value={rawPotentialWinnings}
              decimals={3}
              summitPalette={elevation}
              fontSize="18"
              postfix='SUMMIT'
              postfixFontSize='14'
            /> :
            <Skeleton height={24} width={180}/>
          }
        </Flex>
      </Flex>

      <ContributionBreakdown
        loaded={userDataLoaded}
        breakingDownTitle='YIELD BET'
        breakdownType='FARM'
        contributions={yieldBetContributions}
      />
    </Flex>
  )
}

export default React.memo(ElevationYieldBet)

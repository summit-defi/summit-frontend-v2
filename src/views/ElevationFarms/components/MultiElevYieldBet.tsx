import React from 'react'
import { getBalanceNumber } from 'utils'
import { Text, Flex } from 'uikit'
import { useMultiElevYieldBetInfo } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import { useFarmsUserDataLoaded } from 'state/hooksNew'

const MultiElevYieldBet: React.FC = () => {
  const { elevYieldsBreakdown, totalYieldContributed, totalPotentialWinnings } = useMultiElevYieldBetInfo()
  const userDataLoaded = useFarmsUserDataLoaded()

  const rawYieldContributed = getBalanceNumber(totalYieldContributed)
  const rawPotentialWinnings = getBalanceNumber(totalPotentialWinnings)

  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex alignItems='center' mb='12px' justifyContent='space-around' width='100%' maxWidth='400px'>
        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <Text bold monospace>ROUND YIELD BET:</Text>
          <CardValue
            value={rawYieldContributed}
            decimals={3}
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
            fontSize="18"
            postfix='SUMMIT'
            postfixFontSize='14'
          />
        </Flex>
      </Flex>

      <ContributionBreakdown
        loaded={userDataLoaded}
        breakingDownTitle='YIELD BET'
        contributions={elevYieldsBreakdown}
      />
    </Flex>
  )
}

export default React.memo(MultiElevYieldBet)

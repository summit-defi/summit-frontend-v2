import React from 'react'
import { getBalanceNumber } from 'utils'
import { Text, Flex, Skeleton } from 'uikit'
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
          { userDataLoaded ?
            <CardValue
              value={rawYieldContributed}
              decimals={3}
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
        contributions={elevYieldsBreakdown}
      />
    </Flex>
  )
}

export default React.memo(MultiElevYieldBet)
